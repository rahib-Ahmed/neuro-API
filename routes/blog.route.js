const router = require("express").Router();
const { createBlog, getAllBlogs } = require("../controllers/blog.controller");

router.post("/", createBlog);
router.get("/", getAllBlogs);

module.exports = router;
