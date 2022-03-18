const bcrypt = require('bcrypt');
const configDb = require('../../configs/dataBaseConfigs');
const jwt = require('jsonwebtoken');

const saltRounds = 10;
const jwtExpirySeconds = 4320000;
var db = configDb.db;


 function signUpMethod(body , callback)  {
    const username = GeneratedUserName();
    const { name, email, phone, password } = body;
    encrptionPa(username,name,email,phone,password ,function(re){
    return callback(re);
    });   
}

 function encrptionPa( username, name, email, phone, password , callback){
    var encrpt = bcrypt.hash(password, saltRounds, function (err, hash) {
        if (err) {
            return callback({
                "status": "failed",
                "token": "no"
            });
        }
         insertOnDataBase(username, email, name, phone, hash , function (re){
       
         return callback(re)
         
        });
       
    });
}


 function insertOnDataBase(username, email, name, phone, hash , callback) {
    const qry = "INSERT INTO clients (username,email,name,phone,password) VALUES (? , ? , ? , ? , ?)";
    var u = db.query(qry, [username, email, name, phone, hash], async function (err, result) {
        if (err) {
         return callback ({
                "status": "failed",
                "token": "what" 
            });
        }
        var token = await makeToken(username, name, phone);
        return callback ({
            "status": "success",
            "token": token
        });
    }); 
}



// app.post('/SignUp', (req, res) => {
//     const { username, email, name, phone, password } = req.body;
//     bcrypt.hash(password, saltRounds, function (err, hash) {
//         const qry = "INSERT INTO clients (username,email,name,phone,password) VALUES (? , ? , ? , ? , ?)";
//         db.query(qry, [username, email, name, phone, hash], function (err, result) {
//             if (err) throw err;
//         });
//     });
//     const token = jwt.sign({ username, name, phone }, process.env.JWT_KEYWORD, {
//         algorithm: "HS256",
//         expiresIn: jwtExpirySeconds,
//     })
//     res.status(201).json({
//         status: 'success',
//         token,
//     });

// });


    // const { status, token } = signFinish;
    // if (status == 'success') {
    //     res.status(200).json({
    //         status: 'success',
    //         token,
    //     });
    // } else {
    //     res.status(500).json({
    //         status: 'failed',

    //     });
    // }



    function makeToken(username, name, phone) {
        const token = jwt.sign({ username, name, phone }, process.env.JWT_KEYWORD, {
            algorithm: "HS256",
            expiresIn: jwtExpirySeconds,
        });
        return token;  
    }

function GeneratedUserName() {
    var randomNumber = Math.random();
    var intNumber = randomNumber.toString().substring(2);
    var theNumber = Number(intNumber);
    var uniqeId = Date.now().toString(36) + theNumber.toString(36);
    return uniqeId;
}


module.exports.signUpMethod = signUpMethod;