const passport = require('passport');
const userModel = require("../models/user.model");
const logger = require("../loggingFunction");
const lineNumber = require('../lineNumberFunction');

const facebookStrategy = require('passport-facebook').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    const userObject = userModel.findOne({socialId: id})
    if (userObject) {
        return done(null, userObject)
    }
});


passport.use(new facebookStrategy({
    clientID: `${process.env.FACEBOOK_CLIENTID}`,
    clientSecret: `${process.env.FACEBOOK_SECRET}`,
    callbackURL: "http://localhost:8080/signup/facebookb/callback",
    profileFields: [
        'id',
        'displayName',
        'name',
        'gender',
        'picture.type(large)',
        'email'
    ]
}, function (token, refreshToken, profile, done) {
    try {
        logger("info", profile, "", lineNumber.__line)
        const userObject = userModel.findOne({email: profile.emails[0].value})
        if (userObject) {
            console.log(userObject)
            return done(null, userObject);
        } else {
            const user = new userModel({socialId: profile.id, fullName: profile.displayName, firstName: profile.name.givenName, lastName: profile.name.familyName, email: profile.emails[0].value})
            user.save()
            return done(null, user)
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
}))

passport.use(new LinkedInStrategy({
    clientID: `${process.env.LINKEDIN_CLIENT_ID}`,
    clientSecret: `${process.env.LINKEDIN_CLIENT_SECRET}`,
    callbackURL: "http://localhost:8080/signup/linkedin/callback",
    scope: ['r_emailaddress', 'r_liteprofile'],
}, function (token, tokenSecret, profile, done) {
    try {
        logger("info", profile, "", lineNumber.__line)
        userModel.findOne({email: profile.emails[0].value}).then((userObject) => {
       
        if (userObject) {
            // console.log(userObject)
            return done(null, userObject);
        } else {
            const user = new userModel({
                socialId: profile.id,
                fullName: profile.displayName,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                email: profile.emails[0].value,
                isVerified: true
            })
            user.save()
            return done(null, user)
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
}))

passport.use(new GoogleStrategy({
    // options for google strategy
    clientID: "116257812447-olode1sgl14hhkpdhrhodo7jkiaev5b8.apps.googleusercontent.com",
    clientSecret: "P_qAhTm8h5OP_rOjhnF9o0oD",
    callbackURL: 'http://localhost:8080/signup/google/callback'
}, (accessToken, refreshToken, profile, done) => {
    try {
        logger("info", profile, "", lineNumber.__line)
        userModel
            .findOne({email: profile.emails[0].value})
            .then((userObject) => {
                if (userObject) {
                    return done(null, userObject);
                } else {
                    const user = new userModel({
                        googleId: profile.id,
                        fullName: profile.displayName,
                        firstName: profile.name.givenName,
                        lastName: profile.name.familyName,
                        email: profile.emails[0].value,
                        isVerified: profile._json.email_verified
                    })
                    user.save()
                    return done(null, user)
                }
            })
    } catch (err) {
        console.log(err, lineNumber.__line);
    }

}));