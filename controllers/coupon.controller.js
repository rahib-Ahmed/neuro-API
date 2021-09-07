const {coupon_teacher} = require("../creation")
const couponSchema = require("../models/couponSchema")
const teacherSchema = require("../models/teacherSchema")

module.exports = {
    new_coupon: async function (req, res, obj) {
        await couponSchema
            .findOne({coupon_id: obj.coupon_id})
            .then(async(chk) => {
                if (!chk) {
                    await teacherSchema
                        .findOne({email: obj.generated_by})
                        .then(async(data_teacher) => {
                            if (!data_teacher) {
                                res.send("Unauthorized access")
                            } else {
                                if (data_teacher.coupons.length > 2) {
                                    res.send("Coupon creation length for a month is set to 3")
                                } else {
                                    let new_coupon = new coupon_teacher(obj.coupon_code, obj.is_verified).info()
                                    obj
                                        .save()
                                        .then(async(data) => {
                                            await teacherSchema.findOneAndUpdate({
                                                email: obj.generated_by
                                            }, {
                                                $addToSet: {
                                                    coupons: new_coupon
                                                }
                                            }, (err, result) => {
                                                if (err) {
                                                    res.send(err)
                                                } else {
                                                    const response = {
                                                        teacher: result,
                                                        coupon: data
                                                    }
                                                    res.send(response)
                                                }
                                            })
                                        })
                                }
                            }
                        })
                } else {
                    res
                        .status(401.1)
                        .send("Something went wrong")
                }
            })
    }
}