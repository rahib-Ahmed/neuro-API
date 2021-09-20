const lineNumber = require("../lineNumberFunction");
const logger = require("../loggingFunction");
// module.exports = {
//     new_coupon: async function (req, res, obj) {
//         await couponSchema
//             .findOne({coupon_id: obj.coupon_id})
//             .then(async(chk) => {
//                 if (!chk) {
//                     await teacherSchema
//                         .findOne({email: obj.generated_by})
//                         .then(async(data_teacher) => {
//                             if (!data_teacher) {
//                                 res.send("Unauthorized access")
//                             } else {
//                                 if (data_teacher.coupons.length > 2) {
//                                     res.send("Coupon creation length for a month is set to 3")
//                                 } else {
//                                     let new_coupon = new coupon_teacher(obj.coupon_code, obj.is_verified).info()
//                                     obj
//                                         .save()
//                                         .then(async(data) => {
//                                             await teacherSchema.findOneAndUpdate({
//                                                 email: obj.generated_by
//                                             }, {
//                                                 $addToSet: {
//                                                     coupons: new_coupon
//                                                 }
//                                             }, (err, result) => {
//                                                 if (err) {
//                                                     res.send(err)
//                                                 } else {
//                                                     const response = {
//                                                         teacher: result,
//                                                         coupon: data
//                                                     }
//                                                     res.send(response)
//                                                 }
//                                             })
//                                         })
//                                 }
//                             }
//                         })
//                 } else {
//                     res
//                         .status(401.1)
//                         .send("Something went wrong")
//                 }
//             })
//     }
// }

exports.createCoupon = async (req, res) => {
    try {
        logger("info", req, "", lineNumber.__line);
        const errors = await seqValidator(req, [
          body("title")
            .exists()
            .withMessage("Title is mandatory field")
            .notEmpty()
            .withMessage("Title is mandatory field"),
        ]);
        if (!errors.isEmpty()) {
          logger("error", req, { errors: errors.array() }, lineNumber.__line);
          return res.status(400).send({ errors: errors.array() });
        }
    
        const {
          id = await randomNumber(),
          title,
          tags,
          categories,
          description,
          modifiedOn = new Date().toISOString(),
        } = req.body;
        
        const blogImagedata = req.file
        
        const createdBy = req.user.id
        
        const blog = new BlogModel({
          id,
          title,
          tags,
          categories,
          description,
          modifiedOn,
          createdBy: createdBy,
          imageBlog: {blogImagedata: blogImagedata}
        });
    
        const blogObject = await blog.save();
        
        if(blogObject) {
          const update = {
            $addToSet: {
                blogs: blogObject._id
            }
        }
          await teacherModel.findOneAndUpdate({teacherId: req.user.id}, update)
        }
        return res.status(200).send(blogObject)
    
      } catch (err) {
        logger("error", req, err, lineNumber.__line);
        console.log(err, lineNumber.__line);
        res.status(500).send({
          errors: [
            {
              code: 500,
              message: "Internal Server Error",
              error: err,
            },
          ],
        });
      }
}