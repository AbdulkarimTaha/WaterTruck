require('dotenv').config();

const crypto = require('crypto');
const express = require('express');
const config = require('./src/configs/dataBaseConfigs');
const app = express();



app.use(express.json());


app.post('/clientSignUp', (req, res) => {
    const signUpPage = require('./src/routes/auth/signup');
    signUpPage.signUpMethod(req.body, function (result) {
        const { status, token, code, message } = result;
        res.status(code).json({
            "status": status,
            "token": token,
            "message": message
        });
    });
});


app.post('/clientLogin', (req, res) => {
    const loginPage = require('./src/routes/auth/login');
    loginPage.login(req.body, function (result) {
        const { status, token, code, message } = result;
        res.status(code).json({
            "status": status,
            "token": token,
            "message": message
        });
    });
});

app.post('/customerSignUp', (req , res) => {
    const signUpPage = require('./src/routes/auth/signup');
    signUpPage.customerSignUp(req.body, function (result) {
        const { status, token, code, message } = result;
        res.status(code).json({
            "status": status,
            "token": token,
            "message": message
        });
    });

});

app.post('/customerLogin', (req , res) => {
    const loginPage = require('./src/routes/auth/login');
    loginPage.customerLogin(req.body, function (result) {
        const { status, token, code, message } = result;
        res.status(code).json({
            "status": status,
            "token": token,
            "message": message
        });
    });
    
});


app.listen('3000', () => {
});
