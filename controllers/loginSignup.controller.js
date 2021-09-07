const userModel = require("../models/user.model");
const logger = require("../loggingFunction");
const lineNumber = require('../lineNumberFunction');
const jwt = require('jsonwebtoken');
const secureData = require('../utils/secureData')
const {generateToken, createToken} = require('../utils/generateToken')

const {sendMail} = require("../utils/sendMail");
const {emailValidator, tokenValidator, roleSelected} = require('../validator');
const {seqValidator, checkPassword} = require('../validator');
const {body, param} = require('express-validator');
const {VERIFY_EMAIL, RESET_PASSWORD} = require("../constants")

module.exports = {
    verifyEmail: async function (req, res) {
        try {
            logger("info", req, "", lineNumber.__line)
            const errors = await seqValidator(req, [
                param("token")
                    .trim()
                    .exists()
                    .withMessage("Wrong credentials passed")
                    .custom(tokenValidator)
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
            const userObject = await userModel.findOne({email: req.user.email})

            if (userObject) {
                userObject.isVerified = true
                await userObject.save()
                return res
                    .status(201)
                    .send("User verified, login with your credentials")
            }

            return res
                .status(419)
                .send("Invalid")

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
    },
    signupUser: async function (req, res) {
        // console.log("insid signup")
        try {
            logger("info", req, "", lineNumber.__line);
            const errors = await seqValidator(req, [
                body("email")
                    .isEmail()
                    .withMessage("Invalid email address")
                    .custom(emailValidator),
                body("password")
                    .isLength({min: 8})
                    .exists()
                    .withMessage("Password is mandatory"),
                body("fullName")
                    .exists()
                    .withMessage("full name is mandatory")
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

            var {email, password, fullName, on, role} = req.body;
            password = secureData.encrypt(password)
            const user = new userModel({email, password, fullName, on, role})
            const userObject = await user.save();
            const exp = '3d'
            const obj = {
                email: userObject.email,
                id: userObject._id
            }
            const token = await generateToken(obj, exp)
            const link = `${process.env.BASE_URL}/verify/${token}`
            await sendMail(fullName, email, VERIFY_EMAIL, link);
            res
                .status(201)
                .send(token)
            logger("debug", req, userObject, lineNumber.__line);
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
    },
    login: async function (req, res) {
        try {
            logger("info", req, "", lineNumber.__line)
            const errors = await seqValidator(req, [
                body("email")
                    .isEmail()
                    .exists()
                    .withMessage("Mandatory field"),
                body("password")
                    .exists()
                    .withMessage("Mandatory field")
                    .custom(checkPassword)
            ])
            if (!errors.isEmpty()) {
                logger("error", req, {
                    errors: errors.array()
                }, lineNumber.__line)
                return res
                    .status(400)
                    .send({
                        errors: errors.array()
                    });
            }
            const user = await userModel.findOne({email: req.body.email, isVerified: true})
 
            if (user) {
                const token = await
                createToken(user)
                return res
                    .status(201)
                    .send(token)
            } 
            return res
                .status(401)
                .send("Not verified")

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
    },
    resetPassword: async function (req, res) {
        try {
            logger("info", req, "", lineNumber.__line)
            const errors = await seqValidator(req, [
                body("email")
                    .isEmail()
                    .exists()
                    .withMessage("Email required for password reset")
            ])
            if (!errors.isEmpty()) {
                logger("error", req, err, lineNumber.__line)
            }

            const userObject = await userModel.findOne({email: req.body.email})
            console.log(userObject)
            const exp = '1d'
            const obj = {
                email: userObject.email,
                fullName: userObject.fullName,
                id: userObject._id
            }
            const token = await generateToken(obj, exp)
            const link = `${process.env.BASE_URL}/signup/reset-password/${token}`;
            await sendMail(obj.fullName, obj.email, RESET_PASSWORD, link)
            return res
                .status(200)
                .send("reset link has been sent to your email")
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
    },
    handleReset: async function (req, res) {
        try {
            logger("info", req, "", lineNumber.__line)
            const errors = await seqValidator(req, [
                param("token")
                    .trim()
                    .exists()
                    .withMessage("Wrong credentials passed"),
                body("password")
                    .exists()
                    .withMessage("Password field missins")
            ])
            if (!errors.isEmpty()) {
                logger("error", req, err, lineNumber.__line)
                return res
                    .status(400)
                    .send(errors.array())
            }
            const userObject = await userModel.findById(req.params.userId)
            console.log(req.params.token)
            jwt.verify(secureData.decrypt(req.params.token), `${process.env.ACCESS_TOKEN_SECRET}`, async(err, user) => {
                try {
                    if (!err) {
                        userObject.password = secureData.encrypt(req.body.password)
                        await userObject.save()
                        return res
                            .status(201)
                            .send("Your password has been changed")
                    } else {
                        throw(err)
                    }
                } catch (err) {
                    return res
                        .status(419)
                        .send(err)
                }
            })
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
    },
    socialRoleSelection: async function (req, res) {
        try {
            logger("info", req, "", lineNumber.__line)
            const errors = await seqValidator(req, [
                body("role")
                .trim()
                    .exists()
                    .withMessage("Select a Role").custom(roleSelected)
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
            const update = {
                role: req.body.role,
                roleModel: req.body.role
            }
           const updateRole = await userModel.findByIdAndUpdate(req.user.id, update)
        logger("debug", req, updateRole, lineNumber.__line);
            if (updateRole) {
                return res
                    .status(201)
                    .send(updateRole)
            } else 
                throw("Try again")
        
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
}