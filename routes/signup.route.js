const router = require("express").Router();
const signupController = require('../controllers/loginSignup.controller');
const authenticationMiddleware = require('../middlewares/authenticator.middleware');
const passport = require("passport");
const { auth } = require('../middlewares/authenticator.middleware');

router.post('/users', signupController.signupUser);

router.post("/socialrole", auth, signupController.socialRoleSelection);

router.post('/login', signupController.login);

router.post("/reset", authenticationMiddleware.checkEmail, signupController.resetPassword);

router.post("/reset-password/:token", signupController.handleReset);



router.get("/auth/facebook", passport.authenticate('facebook', { scope: 'email,user_photos' }));

router.get("/facebook/callback", passport.authenticate('facebook', {
    successRedirect: '/signup/facebook/success',
    failureRedirect: '/signup/facebook/failure'
}));

router.get("/facebook/success", authenticationMiddleware.authSocialCheck, (req, res) => {
    return res
        .status(201)
        .send("Logged in")
});

router.get("/facebook/failure", authenticationMiddleware.authSocialCheck, (req, res) => {
    return res
        .status(404)
        .send("Logon failed")
});
router.get('/auth/linkedin', passport.authenticate('linkedin', {
    scope: ['r_liteprofile', 'r_emailaddress']
}));

router.get("/linkedin/callback", passport.authenticate('linkedin', {
    successRedirect: '/signup/linkedin/success',
    failureRedirect: '/signup/linkedin/failure'
}));

router.get("/linkedin/success", authenticationMiddleware.authSocialCheck, (req, res) => {
    return res
        .status(201)
        .send("Logged in")
});

router.get("/linkedin/failure", authenticationMiddleware.authSocialCheck, (req, res) => {
    return res
        .status(404)
        .send("Logon failed")
});

router.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));
router.get('/google/callback', passport.authenticate('google', {
    successRedirect: 'http://localhost:3000/role',
    failureRedirect: 'http://localhost:3000/signup'
}));
// router.get('/google/success',(req, res) => {
//     console.log(req.user)
//     // res.render('profile', { user: req.user });
// });
module.exports = router;