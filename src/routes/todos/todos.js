//import
const statusRequest = require('../../config/status');
const request = require('../../config/requestQuery');

//function
async function getTodo(req, res)
{
    let query = `SELECT * FROM todo`;
    let todoList = await request.requestQuery(query);
    if (todoList.status === 'error') {
        console.log(todoList.res);
        return (res.status(statusRequest.internalServerError).json({ "msg": "internal server error" }));
    }
    console.log(todoList.res[0])
    return (res.status(statusRequest.ok).json(todoList.res[0]));
}

async function getTodoId(req, res)
{
    const id = req.params.id;

    console.log(id);
    if (isNaN(id) == true)
        return (res.status(statusRequest.badRequest).json({ "msg": "Not found" }));
    let query = `SELECT * FROM todo WHERE id='${id}'`;
    let todoId = await request.requestQuery(query);
    if (todoId.status === 'error') {
        console.log(todoId.res);
        return (res.status(statusRequest.internalServerError).json({ "msg": "internal server error" }));
    }
    console.log(todoId.res[0][0]);
    if (todoId.res[0][0] === undefined) {
        return (res.status(statusRequest.badRequest).json({ "msg": "Not found" }));
    }
    if (req.body.createdTodo == "createdTodo")
        return (res.status(statusRequest.created).json(todoId.res[0][0]));
    return (res.status(statusRequest.ok).json(todoId.res[0][0]));
}

async function createTodo(req, res)
{
    const { title, description, due_time, user_id, status } = req.body;

    //verif madatory
    if (title === "" || description === "" || due_time === "" || user_id === ""
    || title === undefined || description === undefined || due_time === undefined || user_id === undefined)
        return (res.status(statusRequest.badRequest).json({ "msg": "mandatory null" }));
    //verif status
    let query = `INSERT INTO todo (title, description, due_time, user_id) VALUES ('${title}', '${description}', '${due_time}', '${user_id}');`;
    if (!(status === undefined)) {
        if (!(status === "not started") && !(status === "todo") && !(status === "in progress") && !(status === "done"))
            return (res.status(statusRequest.badRequest).json({ "msg": "invalid status" }));
        query = `INSERT INTO todo (title, description, due_time, status, user_id) VALUES ('${title}', '${description}', '${due_time}', '${status}', '${user_id}');`;
    }
    //query
    let createdTodo = await request.requestQuery(query);
    if (createdTodo.status === 'error') {
        console.log(createdTodo.res);
        if (createdTodo.res.errno == 1292)
            return (res.status(statusRequest.badRequest).json({ "msg": "invalid date" }));
        if (createdTodo.res.errno == 1452)
            return (res.status(statusRequest.badRequest).json({ "msg": "invalid user id" }));
        return (res.status(statusRequest.internalServerError).json({ "msg": "internal server error" }));
    }
    req.params.id = createdTodo.res[0].insertId;
    req.body.createdTodo = "createdTodo";
    getTodoId(req, res)
}

async function updateTodo(req, res)
{
    const id = req.params.id;
    const { title, description, due_time, user_id, status } = req.body;

    if (isNaN(id) == true)
        return (res.status(statusRequest.badRequest).json({ "msg": "Not found" }));
    let updatedtask = {
        title,
        description,
        due_time,
        user_id,
        status
    }
    const columns = Object.keys(updatedtask);
    const values = Object.values(updatedtask);
    let query = "UPDATE todo SET ";
    for (let index = 0; index < columns.length; index++) {
        if (values[index])
            query += columns[index] + "='" + values[index] + "'";
            if (values[index + 1])
                query += ",";
        console.log(query);
    }
    query += ` WHERE id='${id}'`;
    let updatedTodo = await request.requestQuery(query);
    if (updatedTodo.status === 'error') {
        console.log(updatedTodo.res);
        if (updatedTodo.res.errno == 1292)
            return (res.status(statusRequest.badRequest).json({ "msg": "invalid date" }));
        if (updatedTodo.res.errno == 1452)
            return (res.status(statusRequest.badRequest).json({ "msg": "invalid user id" }));
        return (res.status(statusRequest.internalServerError).json({ "msg": "internal server error" }));
    }
    getTodoId(req, res)
}

async function deleteTodo(req, res)
{
    const id = req.params.id;

    if (isNaN(id) == true)
        return (res.status(statusRequest.badRequest).json({ "msg": "Not found" }));
    let query = `DELETE FROM todo WHERE id='${id}'`;
    let deletedTodo = await request.requestQuery(query);
    if (deletedTodo.status === 'error') {
        console.log(deletedTodo.res);
        return (res.status(statusRequest.internalServerError).json({ "msg": "internal server error" }));
    }
    if (deletedTodo.res[0].affectedRows === 0) {
        return (res.status(statusRequest.badRequest).json({ "msg": "Not found" }));
    }
    return (res.status(statusRequest.ok).json({ "msg": `succesfully deleted record number: ${id}` }));
}

module.exports = {
    getTodo,
    getTodoId,
    createTodo,
    updateTodo,
    deleteTodo
}