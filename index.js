require('dotenv').config();


const crypto = require('crypto');
const express = require('express');


const config = require('./src/configs/dataBaseConfigs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
app.use(express.json());


const saltRounds = 10;
const creatingTable = "CREATE TABLE clients (id SERIAL PRIMARY KEY,username VARCHAR(255),email VARCHAR(255),name VARCHAR(255),phone VARCHAR(255) , password VARCHAR(255));";




 app.post('/SignUp', (req, res) => {
    const signUpPage = require('./src/routes/auth/signup');
    signUpPage.signUpMethod(req.body, function(ret){
        res.status(200).json(ret)
    }) ;
  

    // const { status, token } = m;
    // if (status == 'success') {
    //     res.status(200).json({
    //         status: 'success',
    //         token,
    //     });
    // } else {
    //     res.status(400).json({
    //         status: token ,
    //     });
    // }
  
});
//Todo : all cases + username(generated) 
app.post('/login', (req, res) => {

    var qlTe = 'SELECT * FROM clients WHERE phone = ?';
    db.query(qlTe, [req.body.phone], function (err, result) {
        if (err) throw err;
        const { username, name, phone, password } = result[0];
        bcrypt.compare(req.body.password, password, function (err, result) {
            if (result) {
                const token = jwt.sign({ username, name, phone }, process.env.JWT_KEYWORD, {
                    algorithm: "HS256",
                    expiresIn: jwtExpirySeconds,
                })
                res.status(200).json({
                    status: 'success',
                    token,
                });

            } else {
                res.status(403).json({
                    status: 'username or password is wrong',
                });
            }
        });
    });



});


app.post("/test", (req, res) => {


});

app.listen('3000', () => {
    console.log("worked");
})


