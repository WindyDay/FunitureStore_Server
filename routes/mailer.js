const nodemailer = require('nodemailer');
const {ONL_API_PATH, LOCAL_API_PATH} = require('../constants')

// NB! Store the account object values somewhere if you want
// to re-use the same account for future mail deliveries

// Create a SMTP transporter object

// Message object
exports.createVerifyMail = (to, verifyCode) => {
    let message = {
        // Comma separated list of recipients
        to: to,

        // Subject of the message
        subject: 'Account verify for FunitureOnlineShop',

        // HTML body
        html: `
        <p>Please <b><a href="${LOCAL_API_PATH}/user/verify/${to}/${verifyCode}">CLICK HERE</a></b> to verify your account:</p>
        
        `
    };
    return message;
}

exports.sendMail = (message) => {
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'icecrystal196@gmail.com',
            pass: 'lovean123'
        }
    }, );

    console.log('Created transport');

    transporter.sendMail(message, (error, info) => {
        if (error) {
            console.log('Error occurred');
            console.log(error.message);
            return;
        }

        console.log('Message sent successfully!');

        // only needed when using pooled connections
        transporter.close();
    })
};