const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const crypt = require('../functions/crypt');

const saltRounds = 10;
const Schema = mongoose.Schema;

const UserSchema = Schema(
    {
        login: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        userType: {
            type: String,
            required: true,
            default: 'client'
        },
        ledgerId: {
            type: String,
            required: true
        },
        whoRegistered: {
            type: String,
        },
        orgCredentials: {
            type: String
        }
    }
);

UserSchema.pre('save', function (next) {
    // Check if document is new or a new password has been set
    if (this.isNew || this.isModified('password') || this.isModified('whoRegistered') || this.isModified('orgCredentials')) {
        // Saving reference to this because of changing scopes
        const document = this;

        if (this.isModified('whoRegistered')) {
            document.whoRegistered = crypt.encrypt(document.whoRegistered);
        }

        if (this.isModified('orgCredentials')) {
            document.orgCredentials = crypt.encrypt(document.orgCredentials);
        }

        bcrypt.hash(document.password, saltRounds,
            function (err, hashedPassword) {
                if (err) {
                    next(err);
                }
                else {
                    document.password = hashedPassword;
                    next();
                }
            });
    } else {
        next();
    }
});

UserSchema.path('login').validate((login) => {
    return login.length >= 1 && login.length <= 100;
}, 'Login length must be between 1 and 100');

UserSchema.path('password').validate((password) => {
    return password.length >= 6;
}, 'Password length must be greater than or equal to 6');

UserSchema.path('userType').validate((type) => {
    return ['client', 'fi'].includes(type);
}, 'User type must be client or fi');

module.exports = mongoose.model('User', UserSchema);