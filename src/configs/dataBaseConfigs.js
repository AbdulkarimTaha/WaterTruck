
const mysql = require('mysql');

 const configData = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'watertrck'

}

const db = mysql.createConnection(configData);


db.connect((err) => {
    if (err) {
       console.log("cant connect to db");
    }
    // const creatingTable = "CREATE TABLE customers (id SERIAL PRIMARY KEY,username VARCHAR(255),email VARCHAR(255),name VARCHAR(255),phone VARCHAR(255) , password VARCHAR(255));";
    // db.query(creatingTable, function (err, result) {
    //   if (err) throw err;
    //   console.log("Table created");
    // });
    console.log('connected to db');
});


module.exports ={
    db : mysql.createConnection(configData)
}
