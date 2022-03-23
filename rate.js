const configDb = require('./src/configs/dataBaseConfigs');


const qryRate = "INSERT INTO rate (username,peoplecount,rate) VALUES ( ? , ? , ?)";
const qryRateTable = 'SELECT * FROM rate WHERE username = ? ';
const qryUpateRateTable = "UPDATE rate SET rate = ? , peoplecount = ?  WHERE username = ?";

var db = configDb.db;


function rateClient(body, callback) {
    const { username, rate } = body;
    db.query(qryRateTable, username, function (err, result) {
       
        if (err) return callback({
            "status": "failed",
            "message": "Server Error1",
            code: 500
        });
        if (result == 0) {
            db.query(qryRate, [username, 1, rate], function (err, result) {

                if (err) return callback({
                    "status": "failed",
                    "message": "Server Error12",
                    code: 500
                });

                return callback({
                    "status": "success",
                    "message": "thank you for rating",
                    code: 200
                });
            });
        }else{
            const existUserName = result[0].username ; 
            const existRate = Number( result[0].rate) ;
            const existCountPPL = Number(result[0].peoplecount) ;     
            console.log(existUserName,existRate,existCountPPL);
            var rateSum = (existRate * existCountPPL + 1 * rate) 
            var rateP = (existCountPPL+1) ; 
            var rateRe = rateSum/rateP ;

            db.query(qryUpateRateTable , [rateRe , rateP , existUserName ] ,function(err, result){
                if (err) return callback({
                    "status": "failed",
                    "message": "Server Error12",
                    code: 500
                });
                return callback({
                    "status": "success",
                    "message": "thank you for rating",
                    code: 200
                });
            });
        }
    });

}

module.exports.rateClient = rateClient;