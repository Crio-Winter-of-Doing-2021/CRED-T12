const express = require('express');
const bodyparser = require('body-parser')
const controller = require('./controller/controller');
const router = express.Router();
const jwtVerify = require('../../global/authenticate').verifyUser;
router.use(bodyparser.json());


router.post("/add/:cardId",jwtVerify,controller.addTransaction)
router.get("/analytics/:cardId",jwtVerify,controller.getAnalytics)

module.exports = router;