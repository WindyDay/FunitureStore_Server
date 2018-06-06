const nodemailer = require('nodemailer');


    // NB! Store the account object values somewhere if you want
    // to re-use the same account for future mail deliveries

    // Create a SMTP transporter object
    let transporter = nodemailer.createTransport(
        {
            service: 'Gmail',
            auth: {
                user: 'icecrystal196@gmail.com',
                pass: 'lovean123'
            }
        },
    );

    console.log('Created transport');
    // Message object
    let message = {
        // Comma separated list of recipients
        to: 'Nguyen Dinh Son <001.IcedTea@gmail.com>',

        // Subject of the message
        subject: 'Test mailer',

        // plaintext body
        text: 'Hello to myself!',

        // HTML body
        html:
            '<p><b>Hello</b> to myself <img src="cid:note@example.com"/></p>'
    };

    exports.sendMail = (message)=>{
        transporter.sendMail(message, (error, info) => {
            if (error) {
                console.log('Error occurred');
                console.log(error.message);
                return ;
            }
    
            console.log('Message sent successfully!');
    
            // only needed when using pooled connections
            transporter.close();
        })
    };