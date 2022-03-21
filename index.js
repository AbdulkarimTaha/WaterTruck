require('dotenv').config();


const crypto = require('crypto');
const express = require('express');
const { Dir } = require('fs');
const app = express();
const server = require('http').createServer(app);
const config = require('./src/configs/dataBaseConfigs');
const io = require('socket.io')(server);

app.use(express.json());

let users = {};


io.on('connection', function (socket) {
    socket.on('login', function (data) {
        console.log('a user ' + data.userId + ' connected 1');
        // saving userId to object with socket ID
        users[socket.id] = data.userId
        console.log(users );
     
    });
  
    socket.on('disconnect', function () {
        console.log('user ' + users[socket.id] + ' disconnected');
        // remove saved socket from users object
        delete users[socket.id];
    });
});


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

app.post('/customerSignUp', (req, res) => {
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

app.post('/customerLogin', (req, res) => {

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

app.get('/showUser', function (req, res) {
    res.status(200).json(users);
    console.log(users ,"fefe");
    console.dir(users , "rgerge" );
});


app.get('/connect', async function (req, res) {  
    res.sendFile('indexh.html', { root: __dirname });
});


server.listen('3000', () => {
});
