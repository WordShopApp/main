const AWS = require('aws-sdk');
const moment = require('moment');
const shortid = require('shortid');

const http = require('../services/utils');

const { IS_OFFLINE } = process.env;
const MIN_USERNAME_LENGTH = 5;
const MAX_USERNAME_LENGTH = 15;

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
    TableName: 'WordShop',
    KeyConditionExpression: 'ws_key = :wskey',
    ExpressionAttributeValues: {
      ':wskey': `usr:${email}`
    }
  };
}

function fetchUserByNameParams (username) {
  return {
    TableName: 'WordShop',
    IndexName: 'query_key_01-updated-index',
    KeyConditionExpression: 'query_key_01 = :qk01',
    ExpressionAttributeValues: {
      ':qk01': `usr:username:${username.toLocaleLowerCase()}`
    }
  };
}

function deleteUserParams (user) {
  return {
    TableName: 'WordShop',
    Key: {
      ws_key: `usr:${user.email}`
    }
  };
}

function updateUserParams (user) {
  return {
    TableName: 'WordShop',
    Item: {
      ws_key: user.ws_key,
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      subscription: user.subscription,
      join_mailing_list: user.join_mailing_list,
      project_in_progress: user.project_in_progress,
      critique_in_progress: user.critique_in_progress,
      new_user: user.new_user,
      avatar: user.avatar,
      created: user.created,
      updated: genTimestamp(),
      query_key_01: user.query_key_01
    }
  };
}

function createUserParams (user) {
  return {
    TableName: 'WordShop',
    Item: {
      ws_key: user.ws_key,
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      subscription: user.subscription,
      join_mailing_list: user.join_mailing_list,
      new_user: true,
      project_in_progress: user.project_in_progress,
      critique_in_progress: user.critique_in_progress,
      avatar: user.avatar,
      created: user.created,
      updated: user.updated,
      query_key_01: user.query_key_01
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

function deleteItem (params) {
  return new Promise(function (resolve, reject) {
    //http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#delete-property
    dynamodbDocumentClient().delete(params, function (err, res) {
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

function deleteUser (user) {
  return new Promise(function (resolve, reject) {
    deleteItem(deleteUserParams(user)).then(function (res) {
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

function genUserName (email, shortId) {
  // https://stackoverflow.com/a/20864946
  let name = email.split('@')[0].replace(/[\W_]+/g,'');
  let diff = MAX_USERNAME_LENGTH - shortId.length;
  if (diff > 0) name = name.slice(0, diff);
  return `${name}${shortId}`;
}

function createNewUser (user) {
  return new Promise((resolve, reject) => {
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
  let username = genUserName(data.email, shortid());
  let userId = genUserId();
  return {
    ws_key: `usr:${data.email}`,
    user_id: userId,
    username: username,
    email: data.email,
    avatar: data.avatar,
    cognito_subscription: data.subscription,
    join_mailing_list: data.join_mailing_list,
    new_user: true,
    project_in_progress: null,
    critique_in_progress: null,
    created: now,
    updated: now,
    query_key_01: `usr:username:${username.toLocaleLowerCase()}`
  }
}

function validateBadWords (str) {
  let res = { valid: true, message: '' };
  return res;
}

function isAlphanumericUnderscore (str) {
  return str.match(/^[a-z0-9_]+$/i) !== null;
}

function validateSpecialChars (username) {
  let res = { valid: true, message: '' };
  if (!isAlphanumericUnderscore(username)) {
    res.valid = false;
    res.message = 'Only alphanumeric and underscore characters are allowed';
  }
  return res;
}

function validateLength (username) {
  let res = { valid: true, message: '' };
  if (!username || (username && username.length < MIN_USERNAME_LENGTH)) {
    res.valid = false;
    res.message = `Must contain at least ${MIN_USERNAME_LENGTH} characters`;
  }
  return res;
}

function updateUsernameQueryField (username, updated) {
  if (username) updated.query_key_01 = `usr:username:${username.toLocaleLowerCase()}`;
}

module.exports.usernameValidate = (req, res) => {
  let username = req.params.username;
  let desc = 'GET /profile/validate-username';

  console.log(desc, username);

  // 1) validate special characters
  let vchars = validateSpecialChars(username);
  if (!vchars.valid) return res.status(http.codes.ok).send(vchars);

  // 2) validate bad words
  let vbad = validateBadWords(username);
  if (!vbad.valid) return res.status(http.codes.ok).send(vbad);

  // 3) validate length
  let vlen = validateLength(username);
  if (!vlen.valid) return res.status(http.codes.ok).send(vlen);

  // 4) validate username already exists
  fetchUserByName(username).then(user => {
    if (user.email.toLocaleLowerCase() === req.user.email.toLocaleLowerCase()) {
      console.log(desc, 'Wants to Update Own Username', username);
      res.status(http.codes.ok).send({ valid: true, message: 'This is you!' });
    } else {
      console.log(desc, 'Exists', username);
      res.status(http.codes.ok).send({ valid: false, message: 'Username already taken' });
    }
  }).catch(err => {
    if (err.code === 'AccessDeniedException') {
      console.log(desc, 'Unauthorized', err);
      res.status(http.codes.unauthorized).send({ message: 'unauthorizied' });
    } else if (err.code === 'ResourceNotFoundException') {
      res.status(http.codes.ok).send({ valid: true, message: 'Username available' });
    } else {
      console.log(desc, 'Internal Server Error', err);
      res.status(http.codes.internal_server_error).send({ message: 'internal_server_error' });
    }
  });
};

module.exports.profileCreate = (req, res) => {
  let desc = 'POST /profile';
  let newUser = formatNewUser(req.body);
  fetchUser(newUser.email).then(user => {
    console.log(desc, 'Exists', user);
    res.status(http.codes.ok).send(user);
  }).catch(err => {
    if (err.code === 'AccessDeniedException') {
      console.log(desc, 'Unauthorized', err);
      res.status(http.codes.unauthorized).send({ message: 'unauthorizied' });
    } else if (err.code === 'ResourceNotFoundException') {

      createNewUser(newUser).then(user => {
        console.log(desc, 'Created', user);
        res.status(http.codes.created).send(user);
      }).catch(err => {
        if (err.code === 'AccessDeniedException') {
          console.log(desc, 'Unauthorized', err);
          res.status(http.codes.unauthorized).send({ message: 'unauthorizied' });
        } else {
          console.log(desc, 'Internal Server Error', err);
          res.status(http.codes.internal_server_error).send({ message: 'internal_server_error' });
        }
      });
    } else {
      console.log(desc, 'Internal Server Error', err);
      res.status(http.codes.internal_server_error).send({ message: 'internal_server_error' });
    }
  });
};

module.exports.profileUpdate = (req, res) => {
  let desc = 'PUT /profile';
  let updated = { ...req.user, ...req.body };
  updateUsernameQueryField(req.body.username, updated);
  console.log(desc, 'User', updated);
  updateUser(updated).then(u => {
    res.status(http.codes.ok).send(u);
  }).catch(err => {
    console.log(desc, 'Internal Server Error', err);
    res.status(http.codes.internal_server_error).send({ message: 'internal_server_error' });
  });
};

module.exports.profileShow = (req, res) => {
  console.log('GET /profile', 'User', req.user);
  res.status(http.codes.ok).send(req.user);
};

module.exports.profileDelete = (req, res) => {
  console.log('DELETE /profile', 'User', req.user);
  deleteUser(req.user).then(u => {
    console.log('DELETE /profile', 'Deleted', u);
    res.status(http.codes.ok).send(u);
  }).catch(err => {
    console.log(desc, 'internal_server_error', err);
    res.status(http.codes.internal_server_error).send({ message: 'internal_server_error' });
  });
};