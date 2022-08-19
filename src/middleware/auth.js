//require
const jwt = require('jsonwebtoken');

//import
const statusRequest = require('../config/status');

function verifyAuth(req, res, next)
{
    let token = req.headers.authorization;
    if (token)
        token = token.split(' ')[1];

    if (token === undefined)
        return (res.status(statusRequest.forbidden).json({ "msg": "No token, authorization denied" }));

    jwt.verify(token, process.env.SECRET, function(err, decoded) {
        if (err) {
            console.log(err);
            return (res.status(statusRequest.forbidden).json({ "msg": "Token is not valid" }));
        }
        req.userId = decoded.id;
        next();
    });
}

module.exports = {
    verifyAuth
}