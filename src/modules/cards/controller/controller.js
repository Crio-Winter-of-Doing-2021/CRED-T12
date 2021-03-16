const User = require("../../../models/user");
const Card = require("../../../models/card");
const { Transaction, TransactionType } = require('../../../models/Transaction');
const { PaymentStatus, Payment } = require('../../../models/Payment');
const shortid = require('shortid');
const { state, status } = require('../../../global/responseStatus');
const validator = require('../../../utils/validation');
const schema = require('./validationSchema');
const Luhn = require('luhn-js'); // vation for card numbers
const config = require('../../../global/config');
const {FullDateString} = require('../../../utils/dateFunctions');
/**
    POST /add
    Add a new card
    Request body : {
        "number": {type: "number"}, 
        "bank": { type: "string" },
        "expiaryDate":{ type: "object" },
        "name":{type: "string" },
        "cvc":{type: "number"}
    }
 */
exports.addCard = async (req, res, next) => {
    try {
        if (req.payload) {
            console.log(req.payload);
            const reqBody = req.body;
            const valid = await validator.validate(schema.addCard, reqBody);
            console.log(valid);
            if (!valid) {
                res.status(status.StatusOk).setHeader('Content-Type', 'application/json');
                return res.json({ success: state.faliure, message: "check the request body!" });
            }

            if (!Luhn.isValid(reqBody.number.toString())) {
                await res.status(status.StatusOk).setHeader('Content-Type', 'application/json');
                return res.json({ success: state.faliure, message: "Invalid card number" });
            }

            const alreadyAdded = await Card.exists({ number: reqBody.number });
            if (alreadyAdded) {
                res.status(status.StatusOk).setHeader('Content-Type', 'application/json');
                return res.json({ success: state.faliure, message: "Card already added by someone else, please report if it belongs to you!" });
            }

            const user = await User.findById(req.payload.id);
            if (user === undefined || user === null) {
                res.status(status.StatusOk).setHeader('Content-Type', 'application/json');
                return res.json({ success: state.faliure, message: "User not found" });
            }
            reqBody.userId = user._id;

            const newCard = new Card(reqBody);
            const savedcard = await newCard.save();

            if (!savedcard) {
                res.status(status.StatusOk).setHeader('Content-Type', 'application/json');
                return res.json({ success: state.faliure, message: "Unable to save details" });
            }

            const cardData = {
                id: savedcard.id, 
                number: savedcard.number,
                bank: savedcard.bank,
                name: savedcard.name,
                cvc: savedcard.cvc,
                expiaryDate: savedcard.expiaryDate,
                billingAmount: savedcard.billingAmount
            }
            res.status(status.StatusOk).setHeader('Content-Type', 'application/json');
            return res.json({ success: state.success, data: cardData });
        }
        else {
            await res.status(status.StatusBadRequest).setHeader('Content-Type', 'application/json');
            return res.json({ success: state.faliure, message: "Token not passed" });
        }
    }
    catch (e) {
        console.log(e);
        await res.status(status.StatusInternalServerError).setHeader('Content-Type', 'application/json');
        return res.json({ success: state.faliure, message: "somethig went wrong" });
    }
}

/**
    Get /all
    fetch all cards of logged in user
 */
exports.getAllCards = async (req, res, next) => {
    try {
        if (req.payload) {
            console.log(req.payload);
            const userId = req.payload.id;
            const cards = await Card.find({ userId: userId });

            let cardsArr = [];

            for (const card of cards) {
                const cardData = {
                    id: card._id,
                    number: card.number,
                    bank: card.bank,
                    name: card.name,
                    cvc: card.cvc,
                    expiaryDate: card.expiaryDate,
                    billingAmount: card.billingAmount
                }

                cardsArr.push(cardData);
            }

            res.status(status.StatusOk).setHeader('Content-Type', 'application/json');
            return res.json({ success: state.success, data: cardsArr });
        }
        else {
            res.status(status.StatusBadRequest).setHeader('Content-Type', 'application/json');
            return res.json({ success: state.faliure, message: "Token not passed" });
        }
    }
    catch (e) {
        console.log(e);
        res.status(status.StatusInternalServerError).setHeader('Content-Type', 'application/json');
        return res.json({ success: state.faliure, message: "somethig went wrong" });
    }
}

/**
    Get /single/:cardId
    fetch single card of logged in user by card Id
 */
exports.getSingleCard = async (req, res, next) => {
    try {
        if (req.payload) {
            console.log(req.payload);
            const userId = req.payload.id;
            const cardId = req.params.cardId;
            const card = await Card.findOne({ userId: userId, _id: cardId });
            if (card) {
                const cardData = {
                    id: card._id,
                    number: card.number,
                    bank: card.bank,
                    name: card.name,
                    cvc: card.cvc,
                    expiaryDate: card.expiaryDate,
                    billingAmount: card.billingAmount
                }

                res.status(status.StatusOk).setHeader('Content-Type', 'application/json');
                return res.json({ success: state.success, data: cardData });

            }
            res.status(status.StatusOk).setHeader('Content-Type', 'application/json');
            return res.json({ success: state.faliure, message: "card not found" });
        }
        else {
            res.status(status.StatusBadRequest).setHeader('Content-Type', 'application/json');
            return res.json({ success: state.faliure, message: "Token not passed" });
        }
    }
    catch (e) {
        console.log(e);
        res.status(status.StatusInternalServerError).setHeader('Content-Type', 'application/json');
        return res.json({ success: state.faliure, message: "somethig went wrong" });
    }
}

/**
    Get /history/:cardId
    fetch smartStatement of a card
 */
exports.getHistory = async (req, res, next) => {
    try {
        //pagination
        let perPage = (req.query.perPage === undefined) ? config.statementPerPage : parseInt(req.query.perPage);
        let page = (req.query.page === undefined) ? 1 : parseInt(req.query.page);


        const cardId = req.params.cardId;

        const transactions = await Transaction.find({ cardId: cardId }).skip((page - 1) * perPage).limit(perPage).lean();

        let smartStatement = [];
        for (const transaction of transactions) {

            let statement = {
                amount: transaction.amount,
                date: await FullDateString(transaction.date),
                type: transaction.type,
                transactionId: transaction._id,
                category: transaction.category
            }

            smartStatement.push(statement);
        }

        res.status(status.StatusOk).setHeader('Content-Type', 'application/json');
        return res.json({ success: state.success, data: smartStatement });

    }
    catch (e) {
        console.log(e);
        res.status(status.StatusInternalServerError).setHeader('Content-Type', 'application/json');
        return res.json({ success: state.faliure, message: "somethig went wrong" });
    }
}

/**
    Get /pay/:cardId
    pay bill for a card

    request Body:
    {
        amount : number
    }
*/
exports.payBill = async (req, res, next) => {
    try {
        if (req.payload) {
            console.log(req.payload);
            const reqBody = req.body;
            const userId = req.payload.id;
            const cardId = req.params.cardId;
            const card = await Card.findOne({ userId: userId, _id: cardId });
            if (card) {
                if (reqBody.anount > card.billingAmount) {
                    res.status(status.StatusOk).setHeader('Content-Type', 'application/json');
                    return res.json({ success: state.faliure, message: "card not found" });
                }
                card.billingAmount = card.billingAmount - parseInt(reqBody.amount);
                const savedcard = await card.save();
                if (savedcard) {

                    const payment = {
                        cardId: savedcard.id,
                        date: await new Date(),
                        amount: reqBody.amount,
                        status: PaymentStatus.Successful
                    }

                    const newPayment = new Payment(payment);
                    const savedPayment = await newPayment.save();

                    if (savedPayment) {

                        const paymentReciept = {
                            transactionId: savedPayment.transactionId,
                            cardId: savedPayment.cardId,
                            date: FullDateString(savedPayment.date),
                            status: savedPayment.status,
                            amount: savedPayment.amount,
                        }
                        res.status(status.StatusOk).setHeader('Content-Type', 'application/json');
                        return res.json({ success: state.success, data: paymentReciept });

                    }
                    else {
                        res.status(status.StatusInternalServerError).setHeader('Content-Type', 'application/json');
                        return res.json({ success: state.faliure, message: "unable to generate payment reciept, Contact admin." });
                    }
                }
                else {
                    res.status(status.StatusInternalServerError).setHeader('Content-Type', 'application/json');
                    return res.json({ success: state.faliure, message: "Payment Failed" });
                }
            }
            res.status(status.StatusOk).setHeader('Content-Type', 'application/json');
            return res.json({ success: state.faliure, message: "card not found" });
        }
        else {
            res.status(status.StatusBadRequest).setHeader('Content-Type', 'application/json');
            return res.json({ success: state.faliure, message: "Token not passed" });
        }
    }
    catch (e) {
        console.log(e);
        res.status(status.StatusInternalServerError).setHeader('Content-Type', 'application/json');
        return res.json({ success: state.faliure, message: "somethig went wrong" });
    }
}