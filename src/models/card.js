const shortid = require('shortid');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Card = new Schema({
    _id: {
        type: String,
        default: shortid.generate()
    },
    userId: {
        type: String,
        required: true
    },
    number: {
        type: Number,
        required: true
    },
    bank: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    expiaryDate: {
        month : Number,
        year: Number
    },
    billingAmount: {
        type: Number,
        default: 0
    },
    cvc:{
        type: Number,
        required: true
    }
},{
    timestamps: true
});

module.exports = mongoose.model('card', Card);