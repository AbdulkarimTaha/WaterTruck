require('dotenv').config();


const crypto = require('crypto');
const express = require('express');
const { Dir } = require('fs');
const app = express();
const server = require('http').createServer(app);
const config = require('./src/configs/dataBaseConfigs');
const io = require('socket.io')(server);

app.use(express.json());

let customerId = {};
let users = {};

io.on("connection",  (socket) => {

   

    socket.on('AllUsers' , function (data){

        customerId[socket.id] = data.userId ;
        socket.join("room");
       
    });

    socket.on("askForUser", function (data) {
        io.sockets.in("room").emit('chat',users);
    });
      
 

     socket.on("readyForWork",  function (data) {
        users[socket.id] = data.userId ;
        socket.broadcast.emit("clientList", users);
      
    });
     
    
   

    socket.on("disconnect", (reason) => {
       delete users[socket.id];
       delete customerId[socket.id] ;
       socket.broadcast.emit("clientList", users);
      });

});


app.get('/client', function (req, res) {
    res.sendFile('indexh.html', { root: __dirname });
});
app.get('/customer', function (req, res) {
    res.sendFile('indexk.html', { root: __dirname });
});

app.post('/sendHi', function (req, res) {

});

app.get('/showUser', function (req, res) {

    res.status(200).json({ users: users, customerId: customerId });

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


app.post('/rateClient' , (req , res) =>{
    const rateM = require('./rate');
    rateM.rateClient(req.body, function(re){
        console.log(re);
    });
});
server.listen('3000', () => {
});
