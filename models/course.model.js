var mongoose = require('mongoose');
const {Schema} = mongoose;

const CourseSchema = new mongoose.Schema({
    crsNo: Number,
    teacherId: {
        type: Schema.Types.ObjectId,
        ref: 'Teacher'
    },
    reviews: {
        type: Schema.Types.ObjectId,
        ref: 'Reviews'
    },
    language: String,
    course: String,
    program: String,
    grade: String,
    title: String,
    description: String,
    price: String,
    imageCourse: {
        courseName: {
            type: String,
            default: "true"
        },
        courseImage: {
            type: Array
        }
    },
    status: Boolean,
    isVerified: Boolean,
    createdOn: {
        date_creation: Date,
        timezone: String
    },
    totalVotes: {
        type: Number,
        default: 0
    },
    deleted: {
        type: Boolean,
        default: false
    }
}, {versionKey: false});
CourseSchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: (doc, rec) => {
        delete rec._id;
    }
});

module.exports = mongoose.model('Course', CourseSchema, 'Course');