const lineNumber = require("../lineNumberFunction");
const logger = require("../loggingFunction");
const courseModel = require("../models/course.model");
const reviewModel = require("../models/review.model");

const {parallelValidator, parseDataResume, parsedLanguages, seqValidator} = require('../validator');
const {body, param} = require('express-validator');
const {ReviewUser} = require("../utils/creatingObject");

exports.addReview = async(req, res) => {
    try {
        logger("info", req, "", lineNumber.__line)
        const errors = await seqValidator(req, [
            body("courseId")
                .exists()
                .withMessage("Mandatory"),
            body("review")
                .exists()
                .withMessage("Mandatory"),
            body("starGiven")
                .exists()
                .withMessage("Mandatory")
        ])
        if (!errors.isEmpty()) {
            logger("error", req, {
                errors: errors.array()
            }, lineNumber.__line);
            return res
                .status(400)
                .send({
                    errors: errors.array()
                });
        }
        const reviewObject = await courseModel.findOne({
            _id: req.body.courseId,
            reviews: {
                $exists: true
            }
        }).populate('reviews')
        const reviewByUser = await new ReviewUser(req.user.id, req.body.review, req.body.starGiven, "")
        console.log(reviewObject.reviews.rating.totalStar)
        if (reviewObject) {
            
            reviewObject.reviews.rating.totalStar += parseInt(req.body.starGiven)
            reviewObject.reviews.rating.totalVotes += 1
            reviewObject.reviews.rating.avgRating = reviewObject.reviews.rating.totalStar / reviewObject.reviews.rating.totalVotes

            const update = {
                rating: reviewObject.reviews.rating,
                $addToSet: {
                    reviews: reviewByUser
                }
            }
            const reviewAdded = await reviewModel.findOneAndUpdate({
                _id: reviewObject.reviews._id
            }, update, {new: true})
            console.log(reviewAdded)
            // if (reviewAdded) {     await studentModel.findOneAndUpdate({         _id:
            // req.user.id     }, {         $addToSet: {             reviews:
            // req.body.courseId         }     })
            return res
                .status(200)
                .send("Thank you for the review");
            // }    
        } else {
            const rating = {
                totalStar : req.body.starGiven,
                totalVotes : 1,
                avgRating : req.body.starGiven
            }
            const review = new reviewModel({
                courseId : req.body.courseId,
                rating,
                reviews: reviewByUser
            })

            const reviewObject = await review.save()
            if(reviewObject) {
                await courseModel.findOneAndUpdate({_id: req.body.courseId}, {reviews: reviewObject._id})
            }

        }
    } catch (err) {
        logger("error", req, err, lineNumber.__line);
        console.log(err, lineNumber.__line);
        res
            .status(500)
            .send({
                errors: [
                    {
                        code: 500,
                        message: "Internal Server Error",
                        error: err
                    }
                ]
            });
    }
}