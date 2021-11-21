const db = require("../modules/db");

function session_decode(session) {
    let decode;
    try {
        decode = JSON.parse(Buffer.from(session, 'base64').toString('ascii'));
    } catch (e) {
        decode = {'user_id': 0, 'session_token': 'xxx'};
    }
    return decode;
}

function session_converter(session) {
    let data = session_decode(session);
    const conn = db.connect();
    let key = new Promise(function (res, rej) {
        conn.query(
            "SELECT * FROM users WHERE id = ?",
            [data.user_id],
            function (error, response, fields) {
                if (error) {
                    rej(error);
                } else {
                    try {
                        let session_data = JSON.parse(response[0].session);
                        let filtered_session = session_data.filter( x => x.session == data.session_token);
                        if (filtered_session.length > 0 && response[0].verify == '1') {
                            res(response[0].token);
                        } else {
                            res(null);
                        }
                    } catch (e) {
                        res(null);
                    }
                }
            }
        );
    });
    return key;
}

function auth_checker(key) {
    const conn = db.connect();
    let status = new Promise(function (res, rej) {
        conn.query(
            "SELECT * FROM users WHERE token = ?",
            [key],
            async function (error, response, fields) {
                if (error) {
                    rej(error);
                } else {
                    if (response[0]) {
                        res(true);
                    } else {
                        res(false);
                    }
                }
            }
        );
    });
    return status;
}

module.exports = {
    session_decode,
    session_converter,
    auth_checker
};