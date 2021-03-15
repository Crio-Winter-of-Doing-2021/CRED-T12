const shortid = require('shortid');
var mongoose = require('mongoose');
const crypto = require('crypto');
//require('mongoose-type-email');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
const config = require('../global/config');

var User = new Schema({
    _id: {
        type: String,
        default: shortid.generate()
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: Number
    }
},{
    timestamps: true
});

User.methods.getPasswordHash = async (password) => {
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);
    console.log(hash);
    return hash;
}

User.methods.checkPassword = function (password) {
    console.log(this.password);
    return bcrypt.compareSync(password,this.password);
}

User.methods.generateJWT = function () {

    const user = {
        email: this.email,
        id: this._id
    }

    return jwt.sign(user,config.secretKey,
        {expiresIn:60*60*24*60});
}

User.methods.tokenResponse = function () {
    return {
        _id: this._id,
        email: this.email,
        token: this.generateJWT(),
    };
};
module.exports = mongoose.model('User', User);

