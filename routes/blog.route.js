const router = require("express").Router();
const { createBlog, getAllBlogs } = require("../controllers/blog.controller");
const {upload} = require('../utils/uploadMulter')
const {auth} = require('../middlewares/authenticator.middleware')
const {allowedRole} = require('../middlewares/roles.middleware')

router.post("/createBlog", auth, allowedRole(["Teacher"]), upload.single('blogImagedata'), createBlog);

router.get("/", getAllBlogs);

module.exports = router;
