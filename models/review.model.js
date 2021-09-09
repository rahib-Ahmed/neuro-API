var mongoose = require('mongoose');
const {Schema} = mongoose;
const ReviewSchema = new mongoose.Schema({
    courseId: {
        type: Schema.Types.ObjectId,
        ref: 'Course'
    },
    reviews: [
        {
            reviewerId: {
                type: Schema.Types.ObjectId,
                ref: 'User'
            },
            reviewDate: Date,
            review: String,
            starGiven: Number
        }
    ],
    rating: {
        totalStar: {
            type: Number,
            default: 0
        },
        totalVotes: {
            type: Number,
            default: 0
        },
        avgRating: {
            type: Number,
            default: 0
        }
    },
    isVerified: {
        type: Boolean,
        default: false
    }

}, {versionKey: false})
module.exports = mongoose.model('Reviews', ReviewSchema, 'Reviews');