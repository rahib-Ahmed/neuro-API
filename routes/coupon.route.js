const { auth } = require("../middlewares/authenticator.middleware");
const { roleSelected } = require("../validator");

const router = require("express").Router();

router.post('/createCoupon', auth, roleSelected(["Teacher"]), createCoupon)