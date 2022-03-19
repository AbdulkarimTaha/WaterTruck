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
    });
}); 



app.post('/login', (req, res) => {
    const loginPage = require('./src/routes/auth/login');
    loginPage.login(req.body , function (result){
        const {status , token , code} = result ;
        res.status(code).json({
            "status" : status ,
            "token" : token 
        });
    });
});


app.listen('3000', () => {
})


