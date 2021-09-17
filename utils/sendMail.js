const nodemailer = require('nodemailer');
const secureData = require('./secureData');

function generateEmail(userName, email, type, link) {
    console.log(email)
    if (type === 1) {
        return "<a href=`" + link + "`><p>Click here to verify your account</p></a><h4>Neurolingua Team</h4>"
    }
    if (type === 2) {
        return "<a href=`"+ link +"`><p>Click here to reset your account password</p></a><h4>Neurolingua Team</h4>"
    }
}

function generateMailOptions(userName, email, type, link) {
    if (type === 1) {
        var mailOptions = {
            from: `${process.env.EMAIL}`,
            to: email,
            subject: 'Confirm your account on Neurolingua',
            html: generateEmail(userName, secureData.encrypt(email), type, link)
        };
        return mailOptions;
    }
    if (type === 2) {
        var mailOptions = {
            from: `${process.env.EMAIL}`,
            to: email,
            subject: 'Reset your account password on Neurolingua',
            html: generateEmail(userName, secureData.encrypt(email), type, link)
        };
        return mailOptions;
    }
}
/**
 * ZOHO credentials
 */
// var transporter = nodemailer.createTransport({
//     host: "smtp.zeptomail.in",
//     port: 587,
//     auth: {
//     user: `${process.env.ZOHO_EMAIL}`,
//     pass: `${process.env.ZOHO_EMAIL_PASS}`
//     }
// });

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: `${process.env.EMAIL}`,
        pass: `${process.env.PASSMAIL}`
    }
});
/**
 * 
 * @param {String} userName 
 * @param {String} email 
 * @param {Integer} type 
 * @param {String} link 
 */
async function sendMail(userName, email, type, link) {
    const obj = {
        send: "true"
    };
    transporter.sendMail(generateMailOptions(userName, email, type, link), function (error, info) {
        if (error) {
            console.log(error);
            obj.send = "false"
        } else {
            console.log('Email sent: ' + info.response);
            obj.send = "true"
        }
    });
    const isEmailSend = new Promise((resolve, reject) => {
        if (obj.send === "true") {
            const emailSend = "Email sent"
            resolve(emailSend)
        } else {
            const why = "wait"
            reject(why)
        }
    })
    const checkIsEmailSend = () => {
        isEmailSend.then(result => {
            console.log(result)
            // res.send("Email Sent")
        }).catch(err => {
            console.log(err)
            // res.send("Email not sent")
        })
    }
    checkIsEmailSend()
}
module.exports = {
    sendMail: sendMail
}