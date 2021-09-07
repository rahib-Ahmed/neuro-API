const fetch = require("node-fetch");
const middleware = require("../middleware");
const teacherSchema = require("../models/teacherSchema");
const normalfunction = require("../normalfunction");
const loginSignupService = require("./loginSignupService");

module.exports = {

    linkedin_accesstoken: async function(reqData, req, res, next) {
        await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: reqData
    }).then((chk) => chk.json())
    .then(async (access) => {
        // console.log(access)
       await loginSignupService.linkedin_getEmail(access, req, res, next)
    })
},
}