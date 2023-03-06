const express = require('express');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');
const Router = express.Router();
const viewPath = path.resolve(__dirname, '../templates/views'); 
const partialsPath = path.resolve(__dirname, '../templates/partials');


Router.post('/send-mail',
    async (req, res) => {
        console.log(req.body)
        try {
            let clientDetails = req.body.client;
            let transporter = nodemailer.createTransport({
                host: 'smtp.zoho.com',
                port: 465,
                auth: {
                    user: process.env.SECRET_USER,
                    pass: process.env.SECRET_PASS
                }
            });
            transporter.use('compile', hbs({
                viewEngine: {
                    extName: '.handlebars',
                    layoutsDir: viewPath,
                    defaultLayout: false,
                    partialsDir: partialsPath,
                    express
                },
                viewPath: viewPath,
                extName: '.handlebars',
            }))

            const mailOptions = {
                from: '"CHANGE!" <tony.dev@changeartwork.com>',
                to: req.body.email,
                cc: "admin@change.com.co",
                subject: req.body.subject,
                template: req.body.template_id,
                context: {
                    client: clientDetails
                }
            };

            let info = await transporter.sendMail(mailOptions)
            .then((data) => { return data })
            .catch((error) => { return error });

            if (info.messageId) {
                console.log('Message sent: %s', info.messageId);
                res.status(200).send({ message: 'Mail sent successfully' });
            } else {
                console.log("error log", info);
                res.status(400).send({
                    message: 'Unable to send mail',
                    error: error
                });
            }
        }
        catch (err) {
            res.status(500)
                .send({
                    message: "Something went wrong",
                    error: err.message
                });
        }
    });

module.exports = Router;