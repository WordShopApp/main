const AWS = require('aws-sdk');
const moment = require('moment');
const shortid = require('shortid');
const http = require('../services/utils');

const { IS_OFFLINE } = process.env;

function log (msg, obj) {
  console.log('WordShop API: ' + msg);
  if (obj) console.log(obj);
}

// http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html
function dynamodbDocumentClient () {
  let ddbc;
  if (IS_OFFLINE === 'true') {
    ddbc = new AWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000',
      apiVersion: '2012-08-10'
    });
  } else {
    ddbc = new AWS.DynamoDB.DocumentClient({
      region: 'us-east-1',
      apiVersion: '2012-08-10'
    });
  }
  return ddbc;
}

function fetchUserParams (email) {
  return {
    TableName: 'ws_users',
    IndexName: 'email-index',
    KeyConditionExpression: 'email = :email',
    ExpressionAttributeValues: {
      ':email': email
    }
  };
}

function fetchUserByNameParams (name) {
  return {
    TableName: 'ws_users',
    IndexName: 'username-index',
    KeyConditionExpression: 'username = :username',
    ExpressionAttributeValues: {
      ':username': name
    }
  };
}

function updateUserParams (user) {
  return {
    TableName: 'ws_users',
    Item: {
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      subscription: user.subscription,
      join_mailing_list: user.join_mailing_list,
      new_user: user.new_user,
      avatar: user.avatar,
      created: user.created,
      updated: genTimestamp()
    }
  };
}

function createUserParams (user) {
  return {
    TableName: 'ws_users',
    Item: {
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      subscription: user.subscription,
      join_mailing_list: user.join_mailing_list,
      new_user: true,
      avatar: user.avatar,
      created: user.created,
      updated: user.updated
    }
  };
}

function fetchItem (queryParams) {
  return new Promise(function (resolve, reject) {
    //http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#query-property
    dynamodbDocumentClient().query(queryParams, function (err, res) {
      if (err) return reject(err);

      var item = res && res.Items && res.Items[0];
      if (!item) return reject({ code: 'ResourceNotFoundException' });

      resolve(item);
    });
  });
}

function saveItem (params) {
  return new Promise(function (resolve, reject) {
    //http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#put-property
    dynamodbDocumentClient().put(params, function (err, res) {
      if (err) return reject(err);
      resolve(res);
    });
  });
}

function createItem (params) {
  return new Promise(function (resolve, reject) {
    //http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#put-property
    dynamodbDocumentClient().put(params, function (err, res) {
      if (err) return reject(err);
      resolve(res);
    });
  });
}

function createUser (user) {
  return new Promise(function (resolve, reject) {
    createItem(createUserParams(user)).then(function (res) {
      resolve(user);
    }).catch(reject);
  });
}

function updateUser (user) {
  return new Promise(function (resolve, reject) {
    saveItem(updateUserParams(user)).then(function (res) {
      resolve(user);
    }).catch(reject);
  });
}

function scanItems (params) {
  return new Promise(function (resolve, reject) {
    //http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#scan-property
    dynamodbDocumentClient().scan(params, function (err, res) {
      if (err) return reject(err);
      resolve(res);
    });
  });
}

function updateItem (params) {
  return new Promise(function (resolve, reject) {
    //http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#update-property
    dynamodbDocumentClient().update(params, function (err, res) {
      if (err) return reject(err);
      resolve(res);
    });
  });
}

function fetchUser (email) {
  return new Promise ((resolve, reject) => {
    fetchItem(fetchUserParams(email)).then(resolve).catch(reject);
  });
}

function fetchUserByName (username) {
  return new Promise ((resolve, reject) => {
    fetchItem(fetchUserByNameParams(username)).then(resolve).catch(reject);
  });
}

function genTimestamp () {
  // http://momentjs.com/docs/#/displaying/unix-timestamp-milliseconds/
  return moment().valueOf();
}

function genUserId () {
  // https://github.com/dylang/shortid
  return shortid.generate();
}

function genUserName (email, timestamp) {
  // https://stackoverflow.com/a/20864946
  let name = email.split('@')[0].replace(/[\W_]+/g,'');
  return `${name}${timestamp}`;
}

function createNewUser (user) {
  return new Promise((resolve, reject) => {
    user.user_id = genUserId();
    createUser(user).then(resolve).catch(err => {
      if (err.code === 'TODO: some error code for duplicate userId') {
        createNewUser(user).then(resolve).catch(reject);
      } else {
        reject(err);
      }
    });
  });
}

function formatNewUser (data) {
  let now = genTimestamp();
  return {
    username: genUserName(data.email, now),
    email: data.email,
    avatar: data.avatar,
    subscription: data.subscription,
    join_mailing_list: data.join_mailing_list,
    new_user: true,
    created: now,
    updated: now
  }
}

function isAlphaNumericDashUnderscore (str) {
  return str.match(/^[a-z0-9-_]+$/i) !== null;
}

function validateSpecialChars (username) {
  let res = { valid: true, message: '' };
  if (!isAlphaNumericDashUnderscore(username)) {
    res.valid = false;
    res.message = 'Username must contain only letters, numbers, dashes, or underscores';
  }
  return res;
}

const MIN_USERNAME_LENGTH = 5;
function validateLength (username) {
  let res = { valid: true, message: '' };
  if (!username || (username && username.length < MIN_USERNAME_LENGTH)) {
    res.valid = false;
    res.message = `Username must contain at least ${MIN_USERNAME_LENGTH} characters`;
  }
  return res;
}

module.exports.usernameValidate = (req, res) => {
  let username = req.params.username;
  let desc = 'GET /profile/validate-username';

  console.log(desc, username);

  // 1) validate length
  let vlen = validateLength(username);
  if (!vlen.valid) return res.status(http.codes.ok).send(vlen);

  // 2) validate special characters
  let vchars = validateSpecialChars(username);
  if (!vchars.valid) return res.status(http.codes.ok).send(vchars);

  // 3) validate username already exists
  fetchUserByName(username).then(user => {
    console.log(desc, 'exists', username);
    res.status(http.codes.ok).send({ valid: false, message: 'Username already taken' });
  }).catch(err => {
    if (err.code === 'AccessDeniedException') {
      console.log(desc, 'unauthorized', err);
      res.status(http.codes.unauthorized).send({ message: 'unauthorizied' });
    } else if (err.code === 'ResourceNotFoundException') {
      res.status(http.codes.ok).send({ valid: true, message: 'Username available' });
    } else {
      console.log(desc, 'internal_server_error', err);
      res.status(http.codes.internal_server_error).send({ message: 'internal_server_error' });
    }
  });
};

module.exports.profileCreate = (req, res) => {
  let newUser = formatNewUser(req.body);
  fetchUser(newUser.email).then(user => {
    console.log('POST /profile', 'exists', user);
    res.status(http.codes.ok).send(user);
  }).catch(err => {
    if (err.code === 'AccessDeniedException') {
      console.log('POST /profile', 'unauthorized', err);
      res.status(http.codes.unauthorized).send({ message: 'unauthorizied' });
    } else if (err.code === 'ResourceNotFoundException') {

      createNewUser(newUser).then(user => {
        console.log('POST /profile', 'created', user);
        res.status(http.codes.created).send(user);
      }).catch(err => {
        if (err.code === 'AccessDeniedException') {
          console.log('POST /profile', 'unauthorized', err);
          res.status(http.codes.unauthorized).send({ message: 'unauthorizied' });
        } else {
          console.log('POST /profile', 'internal_server_error', err);
          res.status(http.codes.internal_server_error).send({ message: 'internal_server_error' });
        }
      });
    } else {
      console.log('POST /profile', 'internal_server_error', err);
      res.status(http.codes.internal_server_error).send({ message: 'internal_server_error' });
    }
  });
};

module.exports.profileUpdate = (req, res) => {
  let desc = 'PUT /profile';
  console.log(desc, 'user', req.user);
  fetchUser(req.user).then(user => {
    let updated = { ...user, ...req.body };
    console.log('updated user', updated);
    updateUser(updated).then(u => {
      res.status(http.codes.ok).send(u);
    }).catch(err => {
      if (err.code === 'AccessDeniedException') {
        console.log(desc, 'unauthorized', err);
        res.status(http.codes.unauthorized).send({ message: 'unauthorizied' });
      } else {
        console.log(desc, 'internal_server_error', err);
        res.status(http.codes.internal_server_error).send({ message: 'internal_server_error' });
      }
    })
  }).catch(err => {
    if (err.code === 'AccessDeniedException') {
      console.log('GET /profile', 'unauthorizied', err);
      res.status(http.codes.unauthorized).send({ message: 'unauthorizied' });
    } else if (err.code === 'ResourceNotFoundException') {
      console.log('GET /profile', 'profile_does_not_exist', err);
      res.status(http.codes.not_found).send({ 
        message: 'profile_does_not_exist'
      });
    } else {
      console.log('GET /profile', 'internal_server_error', err);
      res.status(http.codes.internal_server_error).send({ message: 'internal_server_error' });
    }
  });
};

module.exports.profileShow = (req, res) => {
  console.log('GET /profile', 'user', req.user);
  fetchUser(req.user).then(user => {

    console.log('GET /profile', 'found', user);
    res.status(http.codes.ok).send(user);

  }).catch(err => {
    if (err.code === 'AccessDeniedException') {
      console.log('GET /profile', 'unauthorizied', err);
      res.status(http.codes.unauthorized).send({ message: 'unauthorizied' });
    } else if (err.code === 'ResourceNotFoundException') {
      console.log('GET /profile', 'profile_does_not_exist', err);
      res.status(http.codes.not_found).send({ 
        message: 'profile_does_not_exist'
      });
    } else {
      console.log('GET /profile', 'internal_server_error', err);
      res.status(http.codes.internal_server_error).send({ message: 'internal_server_error' });
    }
  });
};
