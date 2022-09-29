require('dotenv').config()
const nodemailer = require('nodemailer');

//email ke body ko html dege text dege to html ignore hojayega
async function sendmail({from,to,subject,text,html}){
 let transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port:process.env.SMTP_PORT,
    secure:false,
    auth:{
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
 });

 let info = await transport.sendMail({

    from : `Goshare<${from}>`,
    to: to,
    subject: subject,
    text: text,
    html:html
    // from: from, //javascript key value same ho to
    // to: to,
    // subject: subject,
    // text: text,
    // html: html
 })

 console.log(info);
}

module.exports = sendmail;