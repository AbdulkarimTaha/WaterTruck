function login(body){


    var qlTe = 'SELECT * FROM clients WHERE phone = ?';

    db.query(qlTe, [body.phone], function (err, result) {
        if (err) throw err;
        const { username, name, phone, password } = result[0];
        bcrypt.compare(body.password, password, function (err, result) {
            if (result) {
                const token = jwt.sign({ username, name, phone }, process.env.JWT_KEYWORD, {
                    algorithm: "HS256",
                    expiresIn: jwtExpirySeconds,
                })
                res.status(200).json({
                    status: 'success',
                    token,
                });

            } else {
                res.status(403).json({
                    status: 'username or password is wrong',
                });
            }
        });
    });


}

