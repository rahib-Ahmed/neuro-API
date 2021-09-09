class ReviewUser {
   
    constructor(reviewerId, review, starGiven, reviewDate) {
        this.reviewerId = reviewerId
        this.review = review
        this.starGiven = parseInt(starGiven)
        this.reviewDate = reviewDate
    }
}
// class CouponTeacher {
//     constructor(coupon_code, status) {
//         this.coupon_code = coupon_code
//         this.status = status
//     }
//     info() {
//         const obj = {
//             date_created: normalfunction.convertDate(0, 0),
//             valid_till: normalfunction.convertDate(30, 0),
//             coupon_code: this.coupon_code,
//             status: this.status
//         }
//         return obj
//     }
// }
module.exports = {
    ReviewUser: ReviewUser,
    // CouponTeacher: CouponTeacher,
}