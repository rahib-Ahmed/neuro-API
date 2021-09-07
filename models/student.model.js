var mongoose = require('mongoose');
const {Schema} = mongoose;

const StudentSchema = new mongoose.Schema({
    studentId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    name: String,
    from: String,
    createdOn: Date,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Course"
        }
    ],
    bookedCourses: [
        {
            type: Schema.Types.ObjectId,
            ref: "Course"
        }
    ]
}, {versionKey: false});
StudentSchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: (doc, rec) => {
        delete rec._id;
    }
});
module.exports = mongoose.model('Student', StudentSchema, 'Student');