//require
const jwt = require('jsonwebtoken');
let bcrypt = require('bcryptjs');

//import
const statusRequest = require('../../config/status');
const request = require('../../config/requestQuery');

async function register(req, res)
{
    const { email, name, firstname, password } = req.body;

    //verif madatory
    if (email === "" || name === "" || firstname === "" || password === ""
    || email === undefined || name === undefined || firstname === undefined || password === undefined)
        return (res.status(statusRequest.badRequest).json({ "msg": "mandatory null" }));

    //hash
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(password, salt);

    //query
    let query = `SELECT email FROM user WHERE email='${email}'`;
    let register = await request.requestQuery(query);
    if (register.status === 'error') {
        console.error(register.res);
        return (res.status(statusRequest.internalServerError).json({ "msg": "internal server error" }));
    }
    if (register.res[0][0] === undefined) {
        let query = `INSERT INTO user (email, password, name, firstname) VALUES ('${email}', '${hash}', '${name}', '${firstname}')`;
        let register = await request.requestQuery(query);
        if (register.status === 'error') {
            console.error(register.res);
            return(res.status(statusRequest.internalServerError).json({ "msg": "internal server error" }));
        }
        //jwt contents
        const user = { id : register.res[0].insertId };
        const token = jwt.sign(user, process.env.SECRET)
        return (res.status(statusRequest.created).json({ "token": token }));
    }
    return (res.status(statusRequest.conflict).json({ "msg": "account already exists" }));
}

async function login(req, res)
{
    const { email, password } = req.body;

    //verif mandatory
    if (email == "" || password == ""
    || email === undefined || password === undefined)
        return (res.status(statusRequest.badRequest).json({"msg": "Invalid Credentials"}));

    let auth = false;

    //query
    let query = `SELECT password , id FROM user WHERE email='${email}'`;
    let login = await request.requestQuery(query);
    if (login.status === 'error') {
        console.log(login.res)
        return (res.status(statusRequest.internalServerError).json({ "msg": "internal server error" }));
    }
    if (login.res[0][0] == undefined)
        return (res.status(statusRequest.badRequest).json({"msg": "Invalid Credentials"}));
    auth = bcrypt.compareSync(password, login.res[0][0].password)
    if (auth == true) {
        //jwt contents
        const user = { id : login.res[0][0].id};
        const token = jwt.sign(user, process.env.SECRET)
        return (res.status(statusRequest.ok).json({ "token": token }));
    }
    return (res.status(statusRequest.badRequest).json({"msg": "Invalid Credentials"}));
}

module.exports = {
    register,
    login
}