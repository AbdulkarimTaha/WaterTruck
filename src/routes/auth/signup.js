const bcrypt = require('bcrypt');
const configDb = require('../../configs/dataBaseConfigs');
const jwt = require('jsonwebtoken');

const saltRounds = 10;
const jwtExpirySeconds = 4320000;
var db = configDb.db;

const qry = "INSERT INTO clients (username,email,name,phone,password) VALUES (? , ? , ? , ? , ?)";
const qryCu = "INSERT INTO customers (username,email,name,phone,password) VALUES (? , ? , ? , ? , ?)";
const uqry = "SELECT phone FROM clients WHERE phone = ?"
const uqryCu = "SELECT phone FROM customers WHERE phone = ?"

// Customer SignUp

function customerSignUp(body, callback) {
    const { name, email, phone, password } = body;
    if (password.length < 6) {
        return callback({
            "status": "failed",
            "token": "null",
            "message" : "password too short",
            code: 400
        });
    } else {
        db.query(uqryCu, [phone], function (err, result) {
            if (err) return callback({
                "status": "failed",
                "token": "null",
                "message" : "Server Error",
                code: 500
            });

            if (result != 0) {
                return callback({
                    "status": "failed",
                    "token": "null",
                    "message" : "User exist",
                    code: 403
                });
            } else {
                const username = GeneratedUserName("022");

                encrption(username, name, email, phone, password, function (re) {
                    return callback(re);
                });
            }
        });
    }
}

function encrption(username, name, email, phone, password, callback) {
    bcrypt.hash(password, saltRounds, function (err, hash) {
        if (err) {
            return callback({
                "status": "failed",
                "token": "null",
                "message" : "Server Error",
                code: 500
            });
        }
        insertOnDb(username, email, name, phone, hash, function (re) {

            return callback(re)

        });

    });
}

function insertOnDb(username, email, name, phone, hash, callback) {
    db.query(qryCu, [username, email, name, phone, hash], async function (err, result) {
        if (err) {
            return callback({
                "status": "failed",
                "token": "null",
                "message" : "Server Error",
                code: 500
            });
        }
        var token = await makeToken(username, name, phone);
        return callback({
            "status": "success",
            "token": token,
            "message" : "signed up",
            code: 200
        });
    });
}





// Client SignUp
function signUpMethod(body, callback) {
    const { name, email, phone, password } = body;
    if (password.length < 6) {
        return callback({
            "status": "failed",
            "token": "null",
            "message" : "password too short",
            code: 400
        });
    } else {
        db.query(uqry, [phone], function (err, result) {
            if (err) return callback({
                "status": "failed",
                "token": "null",
                "message" : "Server Error",
                code: 500
            });

            if (result != 0) {
                return callback({
                    "status": "failed",
                    "token": "null",
                    "message" : "User exist",
                    code: 403
                });
            } else {
                const username = GeneratedUserName("011");

                encrptionPa(username, name, email, phone, password, function (re) {
                    return callback(re);
                });
            }
        });
    }
}


function encrptionPa(username, name, email, phone, password, callback) {
    bcrypt.hash(password, saltRounds, function (err, hash) {
        if (err) {
            return callback({
                "status": "failed",
                "token": "null",
                "message" : "Server Error",
                code: 500
            });
        }
        insertOnDataBase(username, email, name, phone, hash, function (re) {

            return callback(re)

        });

    });
}


function insertOnDataBase(username, email, name, phone, hash, callback) {
    db.query(qry, [username, email, name, phone, hash], async function (err, result) {
        if (err) {
            return callback({
                "status": "failed",
                "token": "null",
                "message" : "Server Error",
                code: 500
            });
        }
        var token = await makeToken(username, name, phone);
        return callback({
            "status": "success",
            "token": token,
            "message" : "signed up",
            code: 200
        });
    });
}






function makeToken(username, name, phone) {
    const token = jwt.sign({ username, name, phone }, process.env.JWT_KEYWORD, {
        algorithm: "HS256",
        expiresIn: jwtExpirySeconds,
    });
    return token;
}

function GeneratedUserName(num) {
    var randomNumber = Math.random();
    var intNumber = randomNumber.toString().substring(2);
    var theNumber = Number(intNumber);
    var uniqeId = num + Date.now().toString(36) + theNumber.toString(36);

    return uniqeId;
}


module.exports.signUpMethod = signUpMethod;
module.exports.customerSignUp = customerSignUp;