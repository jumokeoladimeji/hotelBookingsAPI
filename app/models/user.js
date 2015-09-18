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

var crypto = require('crypto');
UserSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');

    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

UserSchema.methods.validPassword = function(password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');

    return this.hash === hash;
};

module.exports = mongoose.model('User', UserSchema);
