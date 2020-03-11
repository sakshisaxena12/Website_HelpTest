var express = require('express');
var contactRouter = express.Router();
var nodemailer = require('nodemailer');
var multer = require('multer')
var form = multer()

var Messages = require('../models/contact-message')

contactRouter.route('/')
.post(form.none(),(req,res)=>{

    // Store in Database
    Messages.create(req.body)
    .then((Message)=>{
        res.setHeader('Content-Type','application/json')
        res.setStatus = 200
        res.json(Message)
    })
    .catch((err)=>{
        console.error(err);  
        res.sendStatus(304);
    })
    
    // Send Email
    let formData = req.body;
    var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        auth:{
            user: process.env.MAIL_ID,
            pass: process.env.MAIL_PASS,
        },
    })

    var mailOptions = {
        from: process.env.MAIL_ID,
        to: 'richardjob05@gmail.com',//process.env.TO_MAIL_ID,
        subject: `${formData.name} | ${formData.email}`,
        text: formData.message,
    }

    transporter.sendMail(mailOptions,(err,info)=>{
        if(err) console.log(err);
        else console.log(info.response);
    })
    
})

module.exports = contactRouter;