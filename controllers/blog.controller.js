const BlogModel = require("../models/blog.model");
const lineNumber = require("../lineNumberFunction");
const logger = require("../loggingFunction");

const { seqValidator, parallelValidator } = require("../validator");
const { body } = require("express-validator");
const { exists } = require("../models/blog.model");
const {randomNumber} = require('../utils/generateNumber');
const teacherModel = require("../models/teacher.model");
exports.createBlog = async (req, res) => {
  try {
    logger("info", req, "", lineNumber.__line);
    const errors = await seqValidator(req, [
      body("title")
        .exists()
        .withMessage("Title is mandatory field")
        .notEmpty()
        .withMessage("Title is mandatory field"),
    ]);
    if (!errors.isEmpty()) {
      logger("error", req, { errors: errors.array() }, lineNumber.__line);
      return res.status(400).send({ errors: errors.array() });
    }

    const {
      id = await randomNumber(),
      title,
      tags,
      categories,
      description,
      modifiedOn = new Date().toISOString(),
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
      imageBlog: {blogImagedata: blogImagedata}
    });

    const blogObject = await blog.save();
    
    if(blogObject) {
      const update = {
        $addToSet: {
            blogs: blogObject._id
        }
    }
      await teacherModel.findOneAndUpdate({teacherId: req.user.id}, update)
    }
    return res.status(200).send(blogObject)

  } catch (err) {
    logger("error", req, err, lineNumber.__line);
    console.log(err, lineNumber.__line);
    res.status(500).send({
      errors: [
        {
          code: 500,
          message: "Internal Server Error",
          error: err,
        },
      ],
    });
  }
};

exports.getAllBlogs = async (req, res) => {
  try {
    logger("info", req, "", lineNumber.__line);
    const blogs = await BlogModel.find({ isArchived: { $ne: true } });
    logger("debug", req, blogs, lineNumber.__line);
    return res.status(200).send(blogs);
  } catch (err) {
    logger("error", req, err, lineNumber.__line);
    res.status(500).send({
      errors: [
        {
          code: 500,
          message: "Internal Server Error",
          error: err,
        },
      ],
    });
  }
};
