var jwt = require('jsonwebtoken');
var config = require('./config');

function extractToken(req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
        return req.query.token;
    }
    return null;
}

exports.verifyUser = async (req, res, next) => {
    try {
        const token = extractToken(req);
        console.log(token);
        if (token) {
            const decode = await jwt.verify(token, config.secretKey);
            console.log(decode);
            req.payload = decode;
            next();
        }
        else {
            let err = new Error('token not passed');
            err.status = 400;
            next(err);
        }
    }
    catch (e) {
        console.log(e);
        next(e);
    }
}


