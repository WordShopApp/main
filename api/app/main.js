const AWS = require('aws-sdk');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwtDecode = require('jwt-decode');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (token) {
    let data = null;
    try {
      data = jwtDecode(token);
    } catch (e) {
      console.log('error parsing jwt', e);
    }
    req.user = data.email;
  }
  return next();
});

require('./router/init')(app);

module.exports = app;
