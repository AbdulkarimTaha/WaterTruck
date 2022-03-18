
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
    console.log('connected to db');
});


module.exports ={
    db : mysql.createConnection(configData)
}
