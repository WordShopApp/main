const AWS = require('aws-sdk');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwtDecode = require('jwt-decode');

const userService = require('./services/userService');
const http = require('./services/utils');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

function skipUserAuth (req) {
  return req.path.toLowerCase() === '/profile' && 
         req.method.toLowerCase() === 'post'
}

app.use((req, res, next) => {
  let desc = 'USER AUTH';
  let token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (token) {
    let data = null;
    try {
      data = jwtDecode(token);
      if (skipUserAuth(req)) {
        req.user = data.email;
        next();
      } else {
        userService.getByEmail(data.email).then(user => {
          req.user = user;
          next();
        }).catch(err => {
          if (err.code === 'AccessDeniedException') {
            console.log(desc, 'Unauthorizied', err);
            res.status(http.codes.unauthorized).send({ message: 'unauthorizied' });
          } else if (err.code === 'ResourceNotFoundException') {
            console.log(desc, 'Profile Does Not Exist', err);
            res.status(http.codes.not_found).send({ message: 'profile_does_not_exist' });
          } else {
            console.log(desc, 'Internal Server Error', err);
            res.status(http.codes.internal_server_error).send({ message: 'internal_server_error' });
          }
        });
      }
    } catch (e) {
      console.log(desc, 'Error Parsing JWT', e, token);
      res.status(http.codes.unauthorized).send({ message: 'unauthorizied' });
    }
  } else {
    console.log(desc, 'No Auth Header Token Found', token);
    res.status(http.codes.unauthorized).send({ message: 'unauthorizied' });
  }
});

require('./router/init')(app);

module.exports = app;
