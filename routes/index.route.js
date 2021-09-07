var express = require('express');
const signupController = require('../controllers/loginSignup.controller');

var router = express.Router();

router.get('/', async function (req, res, next) {
    res.send('API running');
});
/*  To verify  user  email.*/
router.get('/verify/:token', signupController.verifyEmail)

module.exports = router;
