const User = require("../../../models/user");
const Card = require("../../../models/card");
const { Transaction, TransactionType, getRandomCategory } = require('../../../models/Transaction');
const { PaymentStatus, Payment } = require('../../../models/Payment');
const shortid = require('shortid');
const { state, status } = require('../../../global/responseStatus');
const validator = require('../../../utils/validation');
const schema = require('./validationSchema');
const config = require('../../../global/config');
const { FullDateString, RandomDate, getPastDate } = require('../../../utils/dateFunctions');


/**
    POST /add/:cardId
    Add a random new transactoins
    Request body : {
        transactions: number,
        
    }
 */
exports.addTransaction = async (req, res, next) => {
    try {
        if (req.payload) {
            console.log(req.payload);
            const userId = req.payload.id;
            const reqBody = req.body;
            const valid = await validator.validate(schema.addTransactions, reqBody);
            if (!valid) {
                res.status(status.StatusOk).setHeader('Content-Type', 'application/json');
                return res.json({ success: state.faliure, message: "check the request body!" });
            }

            const user = await User.findById(userId);
            if (user === undefined || user === null) {
                res.status(status.StatusOk).setHeader('Content-Type', 'application/json');
                return res.json({ success: state.faliure, message: "User not found" });
            }

            const cardId = req.params.cardId;
            const card = await Card.findOne({ userId: userId, _id: cardId });

            if (!card) {
                res.status(status.StatusOk).setHeader('Content-Type', 'application/json');
                return res.json({ success: state.faliure, message: "card not found" });
            }

            let transactionArr = [];
            let cardAmount = 0;

            for (let i = 0; i < reqBody.transactions; i++) {
                const amount = Math.floor((Math.random() * 10000) + 100);
                cardAmount += amount;

                const transacrtion = {
                    _id: shortid.generate(amount.toString()),
                    category: getRandomCategory(),
                    date: await RandomDate(new Date(2019, 0, 1), new Date()),
                    amount: amount,
                    type: TransactionType.Debited,
                    cardId: cardId
                }
                transactionArr.push(transacrtion);
            }

            const transactions = await Transaction.insertMany(transactionArr);
            card.billingAmount = cardAmount;
            await card.save();

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

            console.log(transactions);

            res.status(status.StatusOk).setHeader('Content-Type', 'application/json');
            return res.json({ success: state.success, data: smartStatement });
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
    GET analytics/:cardId
    get analytics on expenditures
    
    query params => months={number}&years={number}
 */
exports.getAnalytics = async (req, res, next) => {
    try {
        if (req.payload) {
            console.log(req.payload);
            const userId = req.payload.id;
            const user = await User.findById(userId);
            if (user === undefined || user === null) {
                res.status(status.StatusOk).setHeader('Content-Type', 'application/json');
                return res.json({ success: state.faliure, message: "User not found" });
            }
            const months = (req.query.months === undefined) ? config.analyzingMonths : parseInt(req.query.months);
            const years = (req.query.years === undefined) ? config.analyzingYears : parseInt(req.query.years);
            const pastDate = await getPastDate(years, months);

            console.log(pastDate);

            let transactions = await Transaction.aggregate([
                {
                    $facet: {
                        "dateWiseData": [{
                            $match: {
                                date: { $gt: pastDate }
                            }
                        }, {
                            $group: {
                                _id: { year: { $year: "$date" }, month: { $month: "$date" }, day: { $dayOfMonth: "$date" } },
                                amount: { $sum: '$amount' }
                            }
                        },
                        {
                            $sort: { _id: -1 }
                        }],
                        "categoryWiseData": [{
                            $match: {
                                date: { $gt: pastDate }
                            }
                        }, {
                            $group: {
                                _id: '$category',
                                amount: { $sum: '$amount' }
                            }
                        }]
                    }
                }
            ]);

            transactions = transactions[0];

            const dateWiseData = transactions.dateWiseData;
            const categoryWiseData = transactions.categoryWiseData;

            let dateAnalytics = [];
            let categoryAnalytics = [];

            for(const data of dateWiseData){
                let dateData = {
                    date: {
                        year: data._id.year,
                        month: data._id.month,
                        day: data._id.day
                    },
                    amount: data.amount 
                }
                dateAnalytics.push(dateData);
            }

            for(const data of categoryWiseData){
                let categoryData = {
                    category: data._id,
                    amount: data.amount 
                }
                categoryAnalytics.push(categoryData);
            }


            const analyticsData = {
                dateAnalytics: dateAnalytics,
                categoryAnalytics: categoryAnalytics
            }
            res.status(status.StatusOk).setHeader('Content-Type', 'application/json');
            return res.json({ success: state.success, data: analyticsData });
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

