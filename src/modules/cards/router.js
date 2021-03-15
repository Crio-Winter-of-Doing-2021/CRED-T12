const express = require('express');
const bodyparser = require('body-parser')
const controller = require('./controller/controller');
const router = express.Router();
const jwtVerify = require('../../global/authenticate').verifyUser;
router.use(bodyparser.json());


router.post("/add",jwtVerify,controller.addCard)
router.get("/all",jwtVerify,controller.getAllCards)
router.get("/single/:cardId",jwtVerify,controller.getSingleCard)
router.get("/history/:cardId",jwtVerify,controller.getHistory)
router.post("/pay/:cardId",jwtVerify,controller.payBill)


module.exports = router;