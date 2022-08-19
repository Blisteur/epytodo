//require
let bcrypt = require('bcryptjs');

//import
const statusRequest = require('../../config/status');
const request = require('../../config/requestQuery');

//function
async function getUser(req, res)
{
    let query = `SELECT * FROM user`;
    let userList = await request.requestQuery(query);
    if (userList.status === 'error') {
        console.log(userList.res);
        return (res.status(statusRequest.internalServerError).json({ "msg": "internal server error" }));
    }
    console.log(userList.res[0])
    return (res.status(statusRequest.ok).json(userList.res[0]));
}

async function getUserId(req, res, next)
{
    const id = req.params.id;

    if (isNaN(id) == true)
        return (next());
    let query = `SELECT * FROM user WHERE id='${id}'`;
    let userId = await request.requestQuery(query);
    if (userId.status === 'error') {
        console.log(userId.res);
        return (res.status(statusRequest.internalServerError).json({ "msg": "internal server error" }));
    }
    if (userId.res[0][0] === undefined)
        return (res.status(statusRequest.badRequest).json({ "msg": "Not found" }));
    return (res.status(statusRequest.ok).json(userId.res[0][0]));
}

async function getUserEmail(req, res)
{
    const email = req.params.email;

    let query = `SELECT * FROM user WHERE email='${email}'`;
    let userEmail = await request.requestQuery(query);
    if (userEmail.status === 'error') {
        console.log(userEmail.res)
        return (res.status(statusRequest.internalServerError).json({ "msg": "internal server error" }));
    }
    console.log(userEmail.res[0])
    if (userEmail.res[0][0] === undefined)
        return (res.status(statusRequest.badRequest).json({ "msg": "invalid email" }));
    return (res.status(statusRequest.ok).json(userEmail.res[0][0]));
}

async function deleteUserId(req, res)
{
    const id = req.params.id;

    if (isNaN(id) == true)
        return (res.status(statusRequest.badRequest).json({ "msg": "Not found" }));

    let query = `DELETE FROM user WHERE id='${id}'`;
    let delUser = await request.requestQuery(query);
    if (delUser.status === 'error') {
        console.log(delUser.res)
        return (res.status(statusRequest.internalServerError).json({ "msg": "internal server error" }));
    }
    if (delUser.res[0].affectedRows === 0)
        return (res.status(statusRequest.badRequest).json({ "msg": "Not found" }));
    return (res.status(statusRequest.ok).json({ "msg": `succesfully deleted record number: ${id}` }));
}

async function putUserId(req, res, next)
{
    const id = req.params.id;
    let { email, name, firstname, password } = req.body;

    if (isNaN(id) == true)
        return (res.status(statusRequest.badRequest).json({ "msg": "Not found" }));
    if (password) {
        let salt = bcrypt.genSaltSync(10);
        password = bcrypt.hashSync(password, salt);
    }
    let updatedUser = {
        email,
        name,
        firstname,
        password
    }
    const columns = Object.keys(updatedUser);
    const values = Object.values(updatedUser);
    let query = "UPDATE user SET ";
    for (let index = 0; index < columns.length; index++) {
        if (values[index])
            query += columns[index] + "='" + values[index] + "'";
            if (values[index + 1])
                query += ",";
        console.log(query);
    }
    query += ` WHERE id='${id}'`;
    let putUser = await request.requestQuery(query);
    if (putUser.status === 'error') {
        console.log(putUser.res)
        if (putUser.res.errno == 1062)
            return (res.status(statusRequest.conflict).json({ "msg": "email already exists" }));
        return (res.status(statusRequest.internalServerError).json({ "msg": "internal server error" }));
    }
    getUserId(req, res, next);
}

async function getUserTodos(req, res)
{
    let query = `SELECT * FROM todo WHERE user_id='${req.userId}'`;
    let userTodoList = await request.requestQuery(query);
    if (userTodoList.status === 'error') {
        console.log(userTodoList.res);
        return (res.status(statusRequest.internalServerError).json({ "msg": "internal server error" }));
    }
    console.log(userTodoList.res[0])
    return (res.status(statusRequest.ok).json(userTodoList.res[0]));
}

module.exports = {
    getUser,
    getUserId,
    getUserEmail,
    deleteUserId,
    putUserId,
    getUserTodos
}