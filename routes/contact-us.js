var express = require('express');
var contactRouter = express.Router();
var nodemailer = require('nodemailer');
var multer = require('multer')
var form = multer()

var Messages = require('../models/contact-message')

contactRouter.route('/')
    .post(form.none(), (req, res) => {
        console.log('post request');
        

        // Store in Database
        Messages.create(req.body)
            .then((Message) => {
                console.log('Messages stored in database');
                res.statusCode = 200;
                res.redirect('/#form')
                res.end()
            })
            .catch((err) => {
                console.error(err);
                res.statusCode = 304
                res.end()
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

        mailer.verify((err, success) => {
            if (err) console.log(err);
            else console.log('Signed into email');
        })

        var mailOptions = {
            from: process.env.MAIL_ID,
            to: process.env.TO_MAIL_ID,
            subject: `${formData.name} | ${formData.email}`,
            text: formData.message,
        }

        mailer.sendMail(mailOptions)
            .then((mail) => {
                console.log('Mail Sent');
            })
            .catch((err) => {
                console.log('Mail Failed');
            })

    })

module.exports = contactRouter;
