const bcrypt = require('bcrypt');
const configDb = require('../../configs/dataBaseConfigs');
const jwt = require('jsonwebtoken');


const jwtExpirySeconds = 4320000;
const qlTe = 'SELECT * FROM clients WHERE phone = ?';
var db = configDb.db;



function login(body, callback) {
    const bodyPhone = body.phone;
    const bodyPassword = body.password;

    db.query(qlTe, [bodyPhone], function (err, result) {
        if (err) return callback({
            "status": "failed",
            "token": "null",
            "message" : "Server Error",
            code: 500
        });
        if (result == 0) {
            return callback({
                "status": "failed",
                "token": "null",
                "message" : "User not exist",
                code: 403
            });
        }
        const { username, name, phone, password } = result[0];
        bcrypt.compare(bodyPassword, password, async function (err, result) {
            if (result) {
                var token = await getToken(username, name, phone);
                return callback({
                    "status": "succses",
                    "token": token,
                    "message" : "loged in",
                    code: 200
                });
            } else {
                return callback({
                    "status": "failed",
                    "token": "null",
                    "message" : "Wrong Password",
                    code: 403
                });
            }
        });

    });
}

function getToken(username, name, phone) {
    const token = jwt.sign({ username, name, phone }, process.env.JWT_KEYWORD, {
        algorithm: "HS256",
        expiresIn: jwtExpirySeconds,
    });
    return token;
}



module.exports.login = login;