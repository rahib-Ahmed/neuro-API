const BlogModel = require("../models/blog.model");
const lineNumber = require("../lineNumberFunction");
const logger = require("../loggingFunction");

const {seqValidator, parallelValidator} = require("../validator");
const {body} = require("express-validator");
const {exists} = require("../models/blog.model");
const {randomNumber} = require('../utils/generateNumber');
const teacherModel = require("../models/teacher.model");
const blogModel = require("../models/blog.model");

exports.createBlog = async(req, res) => {
    try {
        logger("info", req, "", lineNumber.__line);
        const errors = await seqValidator(req, [
            body("title")
                .exists()
                .withMessage("Title is mandatory field")
                .notEmpty()
                .withMessage("Title is mandatory field")
        ]);
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
            id = await randomNumber(),
            title,
            tags,
            categories,
            description,
            modifiedOn = new Date().toISOString()
        } = req.body;

        const blogImagedata = req.file

        const createdBy = req.user.id

        const blog = new BlogModel({
            id,
            title,
            tags,
            categories,
            description,
            modifiedOn,
            createdBy: createdBy,
            imageBlog: {
                blogImagedata: blogImagedata
            }
        });

        const blogObject = await blog.save();

        if (blogObject) {

            const update = {
                $addToSet: {
                    blogs: blogObject._id
                }
            }
            const teacherUpdate = await teacherModel.findOneAndUpdate({
                teacherId: req.user.id
            }, update)
            
            if(teacherUpdate) {
            
            return res
                .status(200)
                .send(blogObject)
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
};

exports.getAllBlogs = async(req, res) => {
    try {
        logger("info", req, "", lineNumber.__line);
        const blogs = await BlogModel.find({
            isArchived: {
                $ne: true
            }
        });
        logger("debug", req, blogs, lineNumber.__line);
        return res
            .status(200)
            .send(blogs);
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
};

exports.updateBlog = async(req, res) => {
    try {
        logger("info", req, "", lineNumber.__line)

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

        const blogs = {
            title,
            tags,
            categories,
            description,
            modifiedOn
        } = req.body

        if (req.file != undefined) {
            blog.imageBlog.blogImagedata = req.file
        }

        var filterCourse = _.pickBy(blogs, function (value, key) {
            return !(value === '' || value === undefined)
        });

        const updateBlog = await blogModel.findOneAndUpdate({
            _id: req.params.id
        }, {$set: filterCourse});

        if (updateBlog) {
            return res
                .status(200)
                .send(updateBlog);
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
};

exports.deleteBlog = async(req, res) => {
    try {
        logger("info", req, "", lineNumber.__line);

        const blogs = await blogModel.findOneAndUpdate(req.params.id, {isArchived: true});
        logger("debug", req, blogs, lineNumber.__line);
        if (!blogs) {
            return res
                .status(404)
                .send("Not Found")
        } else {
            const update = {
                $pull: {
                    blogs: req.params.id
                }
            }
            await teacherModel.findOneAndUpdate(req.user.id, update)
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
};

exports.ownerBlogs = async(req, res) => {
    try {
        logger("info", req, "", lineNumber.__line);

        const blogs = await teacherModel
            .findOne({teacherId: req.user.id, isVerified: true})
            .populate({
                path: 'blogs',
                match: {
                    isArchived: true
                },
                select: {
                    '_id': 1,
                    'title': 1,
                    'isVerified': 1,
                    'tags': 1,
                    'id': 1,
                    'description': 1,
                    'createdOn': 1,
                    'modifiedOn': 1
                }
            })
        logger("debug", req, blogs, lineNumber.__line);
        if (!blogs) {
            return res
                .status(404)
                .send("Not Found")
        } else {
          console.log(blogs)
            const newBlog = []
            for (var i = 0; i < blogs.blogs.length; i++) {
                var temp = {
                    _id: blogs
                        .blogs[i]
                        ._id
                        .toString(),
                    title: blogs.blogs[i].title,
                    isVerified: blogs.blogs[i].isVerified,
                    tags: blogs.blogs[i].tags,
                    id: blogs.blogs[i].id,
                    description: blogs.blogs[i].description,
                    createdOn: blogs.blogs[i].createdOn,
                    modifiedOn: blogs.blogs[i].modifiedOn
                }
                newBlog.push(temp)
            }

            return res
                .status(200)
                .send(newBlog);
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