const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const cookieSession = require('cookie-session')

var dotenv = require('dotenv')
dotenv.config()

const blogRouter = require("./routes/blog.route");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const _db = require("./mongodb_conn");

const passport = require("passport");
require('./controllers/passport.controller')

app.use(cookieSession({
    maxAge: 48 * 60 * 60 * 100,
    keys: ["hello"]
}))

app.use(passport.initialize())
app.use(passport.session())

//routes

app.use("/blogs", require("./routes/blog.route"));
app.use('/', require('./routes/index.route'));
// app.use('/users', require('./routes/users')); 
app.use('/teacher', require('./routes/teacher.route')); 
// app.use('/admin', require('./routes/admin'));
// // app.use('/student', usersRouter);
app.use('/signup', require('./routes/signup.route'));
app.use('/course', require('./routes/course.route'));

app.use((_req, res) => {
    res
        .status(404)
        .send({code: "404", messgae: "Resource Not Found"});
});

module.exports = app;
