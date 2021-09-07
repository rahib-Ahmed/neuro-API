const jwt = require('jsonwebtoken');
const lineNumber = require('../lineNumberFunction');
const logger = require('../logger');
const teacherModel = require('../models/teacher.model');
const userModel = require('../models/user.model');

exports.userExistence = async () => {
try {    const existence = await userModel.findOne({_id: req.user.id, onType: {$exists: true}})
    if(existence) next()
    else throw("Does not exist")
}catch(err) {
    logger("error", req, err, lineNumber.__line)
    return res
        .status(404)
        .send(err)
} 
}

exports.allowedRole = function (role) {
    return async(req, res, next) => {
        try {
        if(role.includes(req.user.role))
           next() 
        else 
            throw("Not Authorized")    
        } catch (err) {
            return res
                .status(401)
                .send("Unauthorized")
        }
    }
}
exports.ownerCourse = async function (req, res, next) {
    try
    {        
        const owner = await teacherModel.findOne({teacherId: req.user.id, courses: {$in: req.params.id}})
        if(owner) {
            next()
        } 
        else return res.status(404).send("Not found")
        
        
    } catch (err) {
        return res.status(404).send("Not found")
    }
}