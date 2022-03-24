require('dotenv').config();


const crypto = require('crypto');
const express = require('express');
const { accepts } = require('express/lib/request');
const { Dir } = require('fs');
const app = express();
const server = require('http').createServer(app);
const config = require('./src/configs/dataBaseConfigs');
const io = require('socket.io')(server);

app.use(express.json());

let customerId = {};
let users = {};

var cuRoom = "customer";

io.on("connection", (socket) => {

    socket.on('WaterTruck', function (data) {
        var type = data.type;

        switch (type) {
            case "RFW": // Ready For Work
                users[socket.id] = data.userId;
                break;
            case "AU": // Into All Users Room 
                customerId[socket.id] = data.userId;
                socket.join(onJoin("customer"));
                break ;


        }
    });
    socket.on('AllUsers', function (data) {
        customerId[socket.id] = data.userId;
        socket.join(onJoin("customer"));
        io.to("customer").emit("chat", users);

    });

    function onJoin(room) {
        console.log("Joining room: " + room);
        socket.join(room);
        console.log(socket.id + " now in rooms ", socket.rooms);
    }


    socket.on("readyForWork", function (data) {
        users[socket.id] = data.userId;
        io.to("customer").emit("chat", users);
    });


    socket.on("disconnect", (reason) => {
        delete users[socket.id];
        delete customerId[socket.id];
        io.to("customer").emit("chat", users);
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


app.post('/rateClient', (req, res) => {
    const rateM = require('./rate');
    rateM.rateClient(req.body, function (re) {
        res.status(200).json(re);
    });
});

app.post('getUserData', (req, res) => {
    //todo : get getUserData
});
server.listen('3000', () => {
});
