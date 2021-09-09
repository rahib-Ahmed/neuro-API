const lineNumber = require("../lineNumberFunction");
const logger = require("../loggingFunction");
const {randomNumber} = require("../utils/generateNumber");

const {body} = require('express-validator');
var _ = require('lodash');
const {seqValidator} = require("../validator");

const teacherModel = require("../models/teacher.model");
const studentModel = require("../models/student.model");
const courseModel = require("../models/course.model");


exports.createCourse = async(req, res) => {
    try {
        logger("info", req, "", lineNumber.__line)
        const errors = await seqValidator(req, [
            body("language")
                .trim()
                .exists()
                .withMessage("Mandatory Field"),
            body("course")
                .trim()
                .exists()
                .withMessage("Mandatory Field"),
            body("program")
                .trim()
                .exists()
                .withMessage("Mandatory Field"),
            body("grade")
                .trim()
                .exists()
                .withMessage("Mandatory Field"),
            body("createdOn")
                .trim()
                .exists()
                .withMessage("Mandatory Field"),
            body("title")
                .trim()
                .exists()
                .withMessage("Mandatory Field"),
            body("description")
                .trim()
                .exists()
                .withMessage("Mandatory Field"),
            body("price")
                .trim()
                .exists()
                .withMessage("Mandatory Field"),
            body("courseImage")
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
        const {
            crsNo = await randomNumber(),
            teacherId = req.user.id,
            language,
            course,
            createdOn,
            program,
            grade,
            title,
            description,
            price
        } = req.body
        const courses = new courseModel({
            crsNo,
            teacherId,
            language,
            course,
            createdOn,
            program,
            grade,
            title,
            description,
            price
        })
        courses.imageCourse.courseImage = req.file
        const courseObject = await courses.save()
        if (courseObject) {
            const update = {
                $addToSet: {
                    courses: courseObject._id
                }
            }
            await teacherModel.findOneAndUpdate({
                teacherId: req.user.id
            }, update)
        }
        logger("debug", req, courseObject, lineNumber.__line);
        return res
            .status(201)
            .send(courseObject);
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
exports.updateCourse = async(req, res) => {
    try {
        logger("info", req, "", lineNumber.__line)
        const errors = await seqValidator(req, [
            body("language").trim(),
            body("course").trim(),
            body("program").trim(),
            body("grade").trim(),
            body("createdOn").trim(),
            body("title").trim(),
            body("description").trim(),
            body("price").trim(),
            body("courseImage")
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

        const courses = {
            language,
            course,
            createdOn,
            program,
            grade,
            title,
            description,
            price
        } = req.body

        if (req.file != undefined) {
            courses.imageCourse.courseImage = req.file
        }

        var filterCourse = _.pickBy(courses, function (value, key) {
            return !(value === '' || value === undefined)
        });

        const updateCourse = await courseModel.findOneAndUpdate({
            _id: req.params.id
        }, {$set: filterCourse});

        if (updateCourse) {
            return res
                .status(200)
                .send(updateCourse);
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
exports.getAllCourse = async(req, res) => {
    try {
        logger("info", req, "", lineNumber.__line);
        const courses = await courseModel.find({
            deleted: false,
            isVerified: true
        }, {
            teacherId: 0,
            deleted: 0
        });
        logger("debug", req, courses, lineNumber.__line);
        return res
            .status(200)
            .send(courses);
    } catch (err) {
        logger("error", req, err, lineNumber.__line);
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
exports.deleteCourse = async(req, res) => {
    try {
        logger("info", req, "", lineNumber.__line);

        const courses = await courseModel.findByIdAndUpdate(req.params.id, {deleted: true});
        logger("debug", req, courses, lineNumber.__line);
        if (!courses) {
            return res
                .status(404)
                .send("Not Found")
        } else {
            return res
                .status(200)
                .send("Deleted Successfully");
        }

    } catch (err) {
        logger("error", req, err, lineNumber.__line);
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
