const router = require("express").Router();
const {teacherDetails, createCoupon} = require('../controllers/teacher.controller');
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");
const {allowedRole} = require('../middlewares/roles.middleware')


const multer = require('multer');
const { auth } = require("../middlewares/authenticator.middleware");

const s3 = new aws.S3({
  secretAccessKey: `${process.env.S3_SECRET}`,
  accessKeyId: `${process.env.S3_ACESS_KEY}`,
  region: "ap-south-1"
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
}

const upload = multer({
  fileFilter,
  storage: multerS3({
    acl: "public-read",
    s3: s3,
    bucket: "profileimagedata",
    metadata: function (req, file, cb) {
      cb(null, { fieldName: "TESTING_METADATA" });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + file.originalname);
    },
  }),
});

router.post('/personaldetail', auth, allowedRole(["Teacher"]) , upload.fields([
  {
    name: 'imageProfileData',
    maxCount: 1
  }, {
    name: 'certificateData',
    maxCount: 10
  }
]), teacherDetails)

router.post('/createCoupon', auth, allowedRole(["Teacher"]), createCoupon)



module.exports = router;