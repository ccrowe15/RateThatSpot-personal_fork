// functions for sending emails

const nodemailer = require("nodemailer");
const site = 'http://localhost:3000/';


let transporter = nodemailer.createTransport({
    service: process.env.SERVICE,
    auth: {
      user: process.env.MAILER_EMAIL,
      pass: process.env.MAILER_PASS
    }
});

sendVerificationEmail = async(email, token) => {
    try {
        const subject = "Verify RateThatSpot Account";
        // our client link is hosted on port 3000
        let link = `${site}verify/${token}`;
        const text = `Hello,\n Please click on the following link ${link} verify your RateThatSpot account.\n`;
        
        await transporter.sendMail({
            from: process.env.MAILER_EMAIL,
            to: email,
            subject: subject,
            text: text
        })
    } catch (error) {
        console.log(error, "email not sent");
    }
}

sendRecoveryEmail = async(email, token) => {
    try {
        const subject = "Password Change Request";
        // our client link is hosted on port 3000
        let link = `${site}recover/${token}`;
        const text = `Hello,\n Please click on the following link ${link} to reset your password.\n\nIf you did not request this password reset, please ignore this email and your password will remain unchanged.\n`;
        
        await transporter.sendMail({
            from: process.env.MAILER_EMAIL,
            to: email,
            subject: subject,
            text: text
        })
    } catch (error) {
        console.log(error, "email not sent");
    }
}

sendPasswordChangeEmail = async(email) => {
    try {
        const subject = "Password Change Request";
        const text = `Your account's password was recently changed, please reset your password if this was not done by you.`;
        
        await transporter.sendMail({
            from: process.env.MAILER_EMAIL,
            to: email,
            subject: subject,
            text: text
        })
    } catch(error) {
        console.log(error, "email not sent");
    }
}

sendVerificationSuccess = async(email, username) => {
    try {
        const subject = "Your RateThatSpot Account was verified";
        const text = `Hello ${username}, your account is now verified and you can now login.`;
        
        await transporter.sendMail({
            from: process.env.MAILER_EMAIL,
            to: email,
            subject: subject,
            text: text
        })
    } catch(error) {
        console.log(error, "email not sent");
    }
}

const emailer = {
    sendRecoveryEmail,
    sendPasswordChangeEmail,
    sendVerificationEmail,
    sendVerificationSuccess
  };
module.exports = emailer;