const shortid = require('shortid');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

exports.TransactionType = {
    Debited: "Debited",
    Credited: "Credited"
}
const TransactionCategories = ["fuel", "online shopping","emi", "groceries", "miscellaneous" ]; 

var Transaction = new Schema({
    _id: {
        type: String,
        default: shortid.generate()
    },
    cardId: {
        type: String,
        required: true
    },
    category: String,
    date: Date,
    amount: Number,
    type: String
},{
    timestamps: true
});

exports.Transaction = mongoose.model('transactions', Transaction);

exports.getRandomCategory = function(){
    const categoryIndex = Math.floor((Math.random() * TransactionCategories.length));
    return TransactionCategories[categoryIndex];
}