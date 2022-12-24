require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nsRoute = require('./src/routes/send-mail');
const port = process.env.PORT || 5002;

const app = express();
app.use(express.json());
app.use(cors());
app.use('/v1/api/notification',nsRoute)

app.listen(`${process.env.PORT}`, () => {
  console.log('notification-service started on port '+ `${process.env.PORT}`);
})