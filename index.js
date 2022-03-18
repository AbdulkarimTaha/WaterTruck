require('dotenv').config();


const crypto = require('crypto');
const express = require('express');


const config = require('./src/configs/dataBaseConfigs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
app.use(express.json());




 app.post('/SignUp', (req, res) => {
    

    const signUpPage = require('./src/routes/auth/signup');
    signUpPage.signUpMethod(req.body, function(result){
        const {status , token , code} = result ;
        res.status(code).json({
            "status" : status ,
            "token" : token 
        });
    }) ;
}); 



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


app.listen('3000', () => {
})


