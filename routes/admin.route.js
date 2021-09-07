var express = require('express');
const courseSchema = require('../public/javascripts/models/courseSchema');
const teacherSchema = require('../public/javascripts/models/teacherSchema');
var router = express.Router();


router.post("/getProffessors", async function (req, res, next) {
    await teacherSchema.find({})
    .then((chk) => res.send(chk))
})
router.post("/getCourse", async function (req, res, next) {
    await courseSchema.find({})
    .then((chk) => res.send(chk))
})


module.exports = router;