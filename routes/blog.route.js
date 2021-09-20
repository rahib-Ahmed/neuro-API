const router = require("express").Router();
const { createBlog, getAllBlogs, updateBlog, deleteBlog } = require("../controllers/blog.controller");
const {upload} = require('../utils/uploadMulter')
const {auth} = require('../middlewares/authenticator.middleware')
const {allowedRole, owner} = require('../middlewares/roles.middleware')

router.post("/createBlog", auth, allowedRole(["Teacher"]), upload.single('blogImagedata'), createBlog);

router.get("/", getAllBlogs);   

router.put("/:id", auth, allowedRole(["Teacher", "Admin"]), updateBlog);

router.delete('/:id', auth, allowedRole(["Teacher", "Admin"]), owner, deleteBlog)

module.exports = router;
