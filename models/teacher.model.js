var mongoose = require('mongoose');
const {Schema} = mongoose;

const TeacherSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    teacherId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    coupons: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Coupon'
        }
    ],
    courses: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Course'
        }
    ],
    blogs: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Blogs'
        }
    ],
    teacherProfilePic: {
        imageProfile: {
            type: String,
            default: "true"
        },
        imageProfileData: {
            type: Array
        }
    },
    timezoneProp: {
        timezone: {
            type: String
        },
        timezoneOffset: {
            type: String
        }
    },
    teacherType: String,
    countryCode: String,
    phone: Number,
    gender: String,
    dob: Date,
    aboutMe: String,
    region: {
        fromCountry: String,
        fromState: String,
        currentCountry: String,
        currentState: String
    },
    profession: String,
    accent: String,
    createdOn: Date,
    videoURL: String,
    selfIntro: String,

    consultingAggreement: Boolean,

    languageSpeak: [
        {
            type: String
        }
    ],
    languageTeaches: [
        {
            type: String
        }
    ],
    totalLesson: Number,
    totalStudent: Number,
    rating: {
        score_fun: Number,
        score_motivation_guru: Number,
        score_excellent_materials: Number,
        score_conversation: Number,
        score_exam_coach: Number,
        score_proficiency: Number,
        score_business_expert: Number,
        score_great_with_kids: Number,
        score_accent_reduction: Number,
        score_tech_savvy: Number,
        score_goes_extra_miles: Number,
        score_grammar_expert: Number,
        score_medical_profession: Number,
        score_cultural_insights: Number
    },
    teacherExp: [
        {
            certificate_id: Number,
            cerificate_type: String,
            title: String,
            institution: String,
            locations: String,
            from: Date,
            to: Date,
            is_verified: {
                type: Boolean,
                default: false
            },
            is_deleted: {
                type: Boolean,
                default: false
            },
            certificate_data: Object
        }
    ],
    avgRating: {
        type: Number,
        default: 0
    },
    availability: [
        {
            avail_title: String,
            avail_start: Date,
            aval_end: Date,
            avail_status: Boolean,
            session_deleted: Boolean,
            complete_status: Boolean
        }
    ],
    certificateData: Array,
    ip: String,
    browser: String
}, {versionKey: false});
TeacherSchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: (doc, rec) => {
        delete rec._id;
    }
});
module.exports = mongoose.model('Teacher', TeacherSchema, 'Teacher');