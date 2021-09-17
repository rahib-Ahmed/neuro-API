const { validationResult, body, check } = require("express-validator");
const jwt = require('jsonwebtoken');
const userModel = require("./models/user.model");
const secureData = require('./utils/secureData')
const {capitalizeFirstLetter} = require('./utils/generateNumber')
const {STUDENT, TEACHER} = require('./constants')

const parallelValidator = async (req, validations) => {
    await Promise.all(validations.map((validation) => validation.run(req)));
    return validationResult.withDefaults({
        formatter: (error) => {
            return error.msg instanceof Object
                ? error.msg
                : error;
        }
    })(req);
};

const seqValidator = async (req, validations) => {
    for (let validation of validations) {
        const result = await validation.run(req);
        if (result.errors.length)
            break;
    }
    return validationResult.withDefaults({
        formatter: (error) => {
            return error.msg instanceof Object
                ? error.msg
                : error;
        }
    })(req);
};
// validating Ids : const idValidation = async (re)
const emailValidator = async (email, { req }) => {
    // console.log("insid validator", email)
    return userModel
        .findOne({ email: email })
        .then((chk) => {
            if (chk)
                return Promise.reject('E-mail already exist')
        })
}
const checkPassword = async (paswordRequested, { req }) => {

    return userModel
        .findOne({ email: req.body.email })
        .then(async (chk) => {
            
            if (!chk) {
                return Promise.reject("User does not exist")
            } else {
                const password = await secureData.decrypt(chk.password)
                console.log(password)
                if (password != paswordRequested) {
                    return Promise.reject("Wrong username or password")
                }
            }
        })
}
const tokenValidator = async (tokens, { req }) => {
    const token = secureData.decrypt(tokens)
    const userClaims = await jwt.verify(token, `${process.env.ACCESS_TOKEN_SECRET}`)
    if(userClaims) {
        req.user = userClaims
    }
    else {
        return Promise.reject("Invalid access")
    }
}

const parseDataResume = async (resume, { req } ) => {
    console.log(resume)
   if(resume != undefined) {
    try { 
        const teacherResume = JSON.parse(resume)
           check(teacherResume).isArray()
           req.body.resume = teacherResume
           return Promise.resolve(resume)
        } catch(err) {
            return Promise.reject("Invalid field")
        }
   }
}
const parsedLanguages = async (value) => {
    if(value != undefined) {
        try { 
            const language = JSON.parse(value)
               value = language
               return Promise.resolve(value)
            } catch(err) {
                return Promise.reject("Invalid field")
            }
    }
}
const roleSelected = async (value) => {
    const role = await capitalizeFirstLetter(value);
    role === STUDENT || role === TEACHER ? Promise.resolve(value) : Promise.reject("Bad Request")
}
exports.seqValidator = seqValidator;
exports.parallelValidator = parallelValidator;
exports.emailValidator = emailValidator;
exports.checkPassword = checkPassword;
exports.tokenValidator = tokenValidator;
exports.parseDataResume = parseDataResume;
exports.parsedLanguages = parsedLanguages;
exports.roleSelected = roleSelected