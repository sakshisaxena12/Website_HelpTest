var express = require('express');
var contactRouter = express.Router();
var nodemailer = require('nodemailer');
var multer = require('multer')
var form = multer()

var Messages = require('../models/contact-message')

contactRouter.route('/')
    .post(form.none(), (req, res) => {

        // Store in Database
        Messages.create(req.body)
            .then((Message) => {
                res.status(200)
            })
            .catch((err) => {
                console.error(err);
                res.status(304);
            })

        // Send Email
        let formData = req.body;

        var mailer = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            auth: {
                user: process.env.MAIL_ID,
                pass: process.env.MAIL_PASS,
            },
        })

        mailer.verify((err,success)=>{
            if(err) console.log(err);
            else console.log('Signed into email');
        })

        var mailOptions = {
            from: process.env.MAIL_ID,
            to: process.env.TO_MAIL_ID,
            subject: `${formData.name} | ${formData.email}`,
            text: formData.message,
        }

        mailer.sendMail(mailOptions).then((mail) => {
            console.log('Mail sent');
        })
            .catch((err) => {
                console.log(err);
            })

    })

module.exports = contactRouter;