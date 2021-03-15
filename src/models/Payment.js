const shortid = require('shortid');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

exports.PaymentStatus = {
    Successful: "Successful",
    Failed: "Failed"
}

var Payment = new Schema({
    _id: {
        type: String,
        default: shortid.generate()
    },
    cardId: {
        type: String,
        required: true
    },
    transactionId: {
        type: String,
        default: shortid.generate()
    },
    date: Date,
    amount: Number,
    status: String
},{
    timestamps: true
});

exports.Payment = mongoose.model('payments', Payment);