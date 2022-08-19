const mysql = require('mysql2');

let connection;

connect();

function connect() {
  connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    database: process.env.MYSQL_DATABASE,
    password: process.env.MYSQL_ROOT_PASSWORD
  });
  connection.connect((err) => {
    if (err) {
      setTimeout(connect, 2000);
      return (console.log("DB unconnect"));
    }
    console.log(`MYSQL host connected to ${process.env.MYSQL_HOST}\nDB is ${process.env.MYSQL_DATABASE}`);
    module.exports = connection;
  });
}