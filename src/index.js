//require
const dotenv = require('dotenv').config();
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT_SERVER;

//import
const notFound = require('./middleware/notFound');
const auth = require('./routes/auth/auth');
const user = require('./routes/user/user');
const todo = require('./routes/todos/todos');
const protected = require('./middleware/auth');

//start server
app.listen(port, () => {
    console.log(`APP link:http://localhost:${port}`);
});

//body parser
app.use(express.json());

//auth
app.post("/register", auth.register);
app.post("/login", auth.login);

//user
app.get("/user/", protected.verifyAuth, user.getUser);
app.get("/user/todos", protected.verifyAuth, user.getUserTodos);
app.get("/user/:id", protected.verifyAuth, user.getUserId);
app.get("/user/:email", protected.verifyAuth, user.getUserEmail);
app.put("/user/:id", protected.verifyAuth, user.putUserId);
app.delete("/user/:id", protected.verifyAuth, user.deleteUserId);

//todo
app.get("/todo/", protected.verifyAuth, todo.getTodo);
app.get("/todo/:id", protected.verifyAuth, todo.getTodoId);
app.post("/todo/", protected.verifyAuth, todo.createTodo);
app.put("/todo/:id", protected.verifyAuth, todo.updateTodo);
app.delete("/todo/:id", protected.verifyAuth, todo.deleteTodo);

app.use(notFound.notFound);