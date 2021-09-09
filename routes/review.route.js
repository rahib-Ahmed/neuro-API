const router = require("express").Router();

const {auth} = require("../middlewares/authenticator.middleware");
const {addReview} = require('../controllers/review.controller');

router.post("/addReview", auth, addReview)

module.exports = router