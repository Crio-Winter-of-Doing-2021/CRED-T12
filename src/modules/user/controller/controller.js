const User = require("../../../models/user");
const shortid = require('shortid');
const { state, status } = require('../../../global/responseStatus');
const validator = require('../../../utils/validation');
const schema = require('./validationSchema');
const passport = require('passport');
const request = require('request');

/**
 * Create a new user
 */
exports.signup = async (req, res, next) => {
    try {
        const reqBody = req.body;
        const valid = validator.validate(schema.signup, reqBody);
        if (!valid) {
            res.status(status.StatusOk).setHeader('Content-Type', 'application/json');
            return res.json({ success: state.faliure, message: "check the request body!" });
        }

        const alreadySignedUp = await User.exists({email:reqBody.email});
        if(alreadySignedUp){
            res.status(status.StatusOk).setHeader('Content-Type', 'application/json');
            return res.json({ success: state.faliure, message: "email id already registered!"}); 
        }

        let newUser = await User(reqBody);
        newUser.password = await newUser.getPasswordHash(reqBody.password);
        let savedUser = await newUser.save();
        if (savedUser) {
            res.status(status.StatusOk).setHeader('Content-Type', 'application/json');

            return res.json({ success: state.success, data: await newUser.tokenResponse()}); 
        }
        else {
            res.status(status.StatusInternalServerError).setHeader('Content-Type', 'application/json');
            return res.json({ success: state.faliure, message: "unable to save user" });
        }
    }
    catch (e) {
        console.log(e);
        res.status(status.StatusInternalServerError).setHeader('Content-Type', 'application/json');
        return res.json({ success: state.faliure, message: "somethig went wrong" });
    }
}

/**
 * login 
 */
exports.login = async (req, res, next) => {
    try {
        const reqBody = req.body;
        const valid = validator.validate(schema.login, reqBody);
        if (!valid) {
            res.status(status.StatusOk).setHeader('Content-Type', 'application/json');
            return res.json({ success: state.faliure, message: "check the request body!" });
        }

        await passport.authenticate('local', { session: false }, (err, passportUser, info) => {
            if (err) {
                return next(err);
            }

            if (passportUser) {
                const user = passportUser;
                const data = user.tokenResponse();
                res.status(status.StatusOk).setHeader('Content-Type', 'application/json');
                return res.json({ success: state.success, data: data });
            }

            res.status(status.StatusOk).setHeader('Content-Type', 'application/json');
            return res.json({ success: state.faliure, message: info });
        })(req, res, next);
    }
    catch (e) {
        console.log(e);
        res.status(status.StatusInternalServerError).setHeader('Content-Type', 'application/json');
        return res.json({ success: state.faliure, message: "somethig went wrong" });
    }
}

/**
 * get the user details from jwt token 
 */
exports.auth = async (req, res, next) => {
    try {
        if (req.payload) {
            console.log(req.payload);
            const user = await User.findById(req.payload.id);

            if (user === undefined || user === null) {
                res.status(status.StatusOk).setHeader('Content-Type', 'application/json');
                return res.json({ success: state.faliure, message: "User not found" });
            }

            const userData = {
                userId: user._id,
                username:user.username,
                email:user.email,
                phoneNumber:user.phoneNumber
            }

            res.status(status.StatusOk).setHeader('Content-Type', 'application/json');
            return res.json({ success: state.success, data: userData });
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
 * testing the jwt token (dev use)
 */
exports.test = async (req, res, next) => {
    res.json({ status: state.success })
}
