const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const saltRounds = 10;
const Schema = mongoose.Schema;

const FiSchema = Schema(
    {
        login: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        ledgerId: {
            type: String,
            required: true
        },
        ledgerUser: {
            type: String
        },
        orgNum: {
            type: Number
        }
    }
);

FiSchema.pre('save', function (next) {
    // Check if document is new or a new password has been set
    if (this.isNew || this.isModified('password')) {
        // Saving reference to this because of changing scopes
        const document = this;
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

FiSchema.path('login').validate((login) => {
    return login.length >= 1 && login.length <= 100;
}, 'Login length must be between 1 and 100');

FiSchema.path('password').validate((password) => {
    return password.length >= 6;
}, 'Password length must be greater than or equal to 6');

module.exports = mongoose.model('Fi', FiSchema);