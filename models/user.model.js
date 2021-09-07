var mongoose = require('mongoose');
const { Schema } = mongoose;
const UserSchema = new mongoose.Schema({
    email: String,
    password: String,
    role: String,
    fullName: String,
    firstName: String,
    lastName: String,
    googleId: String,
    facebookId: String,
    linkedinId: String,
    isVerified: {
        type: Boolean,
        default: false
    },
    onType: {
        type: Schema.Types.ObjectId,
        refPath: 'roleModel'
    },
    roleModel: {
        type: String,
        enum: ['Teacher', 'Student']
    },
    token: String
}, { versionKey: false })
module.exports = mongoose.model('User', UserSchema, 'User');