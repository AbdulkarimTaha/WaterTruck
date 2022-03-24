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

let cuSocket = {};
let usersSocket = {};

var cuRoom = "customer";

io.on("connection", (socket) => {

    socket.on('WaterTruck', function (data) {
        var type = data.type;
        switch (type) {
            case "RFW": // Ready For Work
                usersSocket[socket.id] = data.username;
                io.to("customer").emit("chat", usersSocket);
                break;
            case "AU": // Into All Users Room 
                cuSocket[socket.id] = data.username;
                socket.join(onJoin("customer"));
                io.to("customer").emit("chat", usersSocket);
                break;
            case "CRBCAC": //Create Room Between Clint and customer        
                var customerID = data.customerID;
                var roomName = data.roomName;
                let socketBID = Object.keys(cuSocket).find(key => cuSocket[key] === customerID);
                const socketB = io.sockets.sockets.get(socketBID);
                socket.join(onJoin(roomName));
                socketB.join(onJoin2(socketB,roomName));
                io.to(roomName).emit(roomName, "roomName");
                break ;
                
        }
    });

    // socket.on('AllUsers', function (data) {
    //     customerId[socket.id] = data.userId;
    //     socket.join(onJoin("customer"));
    //     io.to("customer").emit("chat", users);

    // });
    function onJoin2(socketb ,room) {
        var socketb = socketb ;
        console.log("Joining room: " + room);
        socketb.join(room);
        console.log(socketb.id + " now in rooms ", socketb.rooms);
    }
    function onJoin(room) {
        console.log("Joining room: " + room);
        socket.join(room);
        console.log(socket.id + " now in rooms ", socket.rooms);
    }
    // socket.on("readyForWork", function (data) {
    //     users[socket.id] = data.userId;
    //     io.to("customer").emit("chat", users);
    // });


    socket.on("disconnect", (reason) => {
        delete usersSocket[socket.id];
        delete cuSocket[socket.id];
        io.to("customer").emit("chat", usersSocket);
    });

});


app.get('/client', function (req, res) {
    res.sendFile('indexh.html', { root: __dirname });
});
app.get('/customer', function (req, res) {
    res.sendFile('indexk.html', { root: __dirname });
});

app.get('/showUser', function (req, res) {

    res.status(200).json({ users: usersSocket, customerId: cuSocket });

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
