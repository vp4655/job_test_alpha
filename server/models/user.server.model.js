'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');

var validateLocalStrategyPassword = function(password) {
    return (this.provider !== 'local' || (password && password.length > 6));
};

var UserSchema = new Schema({
    username: {
        type: String,
        unique: 'testing error message',
        required: 'Please fill in a username',
        trim: true
    },
    password: {
        type: String,
        default: '',
        validate: [validateLocalStrategyPassword, 'Password should be longer']
    },
    salt: {
        type: String
    },
    updated: {
        type: Date
    },
    created: {
        type: Date,
        default: Date.now
    }
});

UserSchema.pre('save', function(next) {
    if (this.password && this.password.length > 6) {
        this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
        this.password = this.hashPassword(this.password);
    }

    next();
});

UserSchema.methods.hashPassword = function(password) {
    if (this.salt && password) {
        return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
    } else {
        return password;
    }
};

UserSchema.methods.authenticate = function(password) {
    return this.password === this.hashPassword(password);
};

mongoose.model('User', UserSchema);