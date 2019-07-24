const sgMail = require('@sendgrid/mail')


sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email,name) => {
    sgMail.send({
        to : email,
        from : 'desloubser2@gmail.com',
        subject : 'Welcome to the task app',
        text : `Welcome to the app, ${name}. Let us know how the app is functioning`
    })
}

const sendFarewellEmail = (email,name) => {
    sgMail.send({
        to : email,
        from : 'desloubser2@gmail.com',
        subject : 'Good Bye',
        text : `So sad to see you go, ${name}. Please let us know why you are leaving`
    })
}

module.exports = {
    sendWelcomeEmail, sendFarewellEmail
}
