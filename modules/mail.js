var nodemailer = require("nodemailer");

let config;
try {
    config = require('../config');
} catch (e) {
    console.log('No config file found');
    process.exit(0);
}

function send(email, token) {
    var email = email;
    var token = token;
    var mail = nodemailer.createTransport({
        host: config.mail.host,
        port: config.mail.port,
        secure: false,
        auth: {
            user: config.mail.user,
            pass: config.mail.password,
        },
        tls: {
            rejectUnauthorized: false,
        },
    });
    var mailOptions = {
        from: config.mail.user,
        to: email,
        subject: "Account Verification - Nekoya",
        html: `<p>Hello!!! Please click this link <a href="${config.host}/verify-email?token=${token}">link</a> to verify your account!!! Thanks!!!</p>`
    };
    mail.sendMail(mailOptions, function (error, info) {
        if (error) {
            return 1;
        } else {
            return 0;
        }
    });
}

module.exports = {
    send
}