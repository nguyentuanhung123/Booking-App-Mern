const mongoose = require('mongoose');
const {Schema} = mongoose;

const UserSchema = new Schema({
    name: String,
    email: {type: String, unique: true},//email là duy nhất
    password: String,
    phone: Number,
    gender: String,
    dateOfBirth: String,
    role: String,
    verifyToken: {
        type: String
    }
});

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;

