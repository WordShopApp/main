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
  console.log('-----------AUTH MIDDLEWARE:authorization', req.headers.authorization);
  let token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  console.log('-----------AUTH MIDDLEWARE:token', token);
  if (token) {
    let data = null;
    try {
      data = jwtDecode(token);
    } catch (e) {
      console.log('error parsing jwt', e);
    }
    console.log('-----------AUTH MIDDLEWARE:email', data.email);
    req.user = data.email;
  }
  next();
});

require('./router/init')(app);

module.exports = app;
