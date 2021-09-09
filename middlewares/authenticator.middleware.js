const jwt = require('jsonwebtoken');
const lineNumber = require('../lineNumberFunction');
const logger = require('../loggingFunction');
const userModel = require('../models/user.model');
const secureData = require('../utils/secureData');



    module.exports = {
        auth: async (req, res, next) => {
          
            let token = req.headers['authorization']
           
            token = token.split(' ')[1]
        
            var tokens = secureData.decrypt(token)
            try {
                const userClaims = await jwt.verify(tokens, `${process.env.ACCESS_TOKEN_SECRET}`)
                // console.log(userClaims)
                if (userClaims) {
                    req.user = userClaims
                    next()
                } else {
                    throw ("Unauthorized")
                }
            } catch (err) {
                logger("error", req, err, lineNumber.__line)
                return res
                    .status(404)
                    .send(err)
            }
        },
        checkEmail: async (req, res, next) => {
            try {
                userModel
                    .findOne({ email: req.body.email })
                    .then((chk) => {
                        if (!chk) {
                            res
                                .status(400)
                                .send("User does not exist")
                        } else {
                            next()
                        }
                    })
            } catch (err) {
                console.log(err)
            }
        },
        authSocialCheck: async (req, res, next) => {
            if (!req.user) {
                return res
                    .status(401)
                    .send("You need to log in")
            } else {
                next()
            }
        }
    }