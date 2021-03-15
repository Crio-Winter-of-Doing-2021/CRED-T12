const express = require('express');
const bodyparser = require('body-parser')
const controller = require('./controller/controller');
const router = express.Router();
const authenticate = require('../../global/authenticate');
router.use(bodyparser.json());


router.post("/sign-up",controller.signup)
router.post("/login",controller.login)
router.get("/auth",authenticate.verifyUser,controller.auth)
router.get("/test",authenticate.verifyUser,controller.test)


module.exports = router;