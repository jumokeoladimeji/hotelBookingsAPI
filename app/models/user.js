var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    email: 
        {
            type: String,
            trim: true,
            unique: true,
            default: '',
            match: [/.+\@.+\..+/, 'Please fill a valid email address']
        },
    password: {
        type: String,
        trim: true,
        default: ''
    },
    username: {
        type: String,
        lowercase: true,
        unique: true,
        required: 'Please fill in a username',
        trim: true
    },
    role: {
        type: String,
        default: 'developer',
        enum: ['developer', 'admin']
    },
    token: String,
    hash: String,
    salt: String
});


module.exports = mongoose.model('User', UserSchema);

