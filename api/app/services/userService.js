let dynamodbService = require('./dynamodbService');

function getParams (userId) {
  return {
    TableName: 'WordShop',
    Key: {
      'ws_key': `usr:${userId}`
    }
  }
}

function getByEmailParams (email) {
  return {
    TableName: 'WordShop',
    IndexName: 'query_key_01-updated-index',
    KeyConditionExpression: 'query_key_01 = :qk01',
    ExpressionAttributeValues: {
      ':qk01': `usr:email:${email.toLocaleLowerCase()}`
    }
  };
}

function getByUsernameParams (username) {
  return {
    TableName: 'WordShop',
    IndexName: 'query_key_02-created-index',
    KeyConditionExpression: 'query_key_02 = :qk02',
    ExpressionAttributeValues: {
      ':qk02': `usr:username:${username.toLocaleLowerCase()}`
    }
  };
}

function get (userId) {
  return new Promise ((resolve, reject) => {
    dynamodbService
      .getSingleItem(getParams(userId))
      .then(resolve)
      .catch(reject);
  });
}

function getByEmail (email) {
  return new Promise ((resolve, reject) => {
    dynamodbService
      .getItem(getByEmailParams(email))
      .then(resolve)
      .catch(reject);
  });
}

function getByUsername (username) {
  return new Promise ((resolve, reject) => {
    dynamodbService
      .getItem(getByUsernameParams(username))
      .then(resolve)
      .catch(reject);
  });
}

module.exports = {
  get: get,
  getByEmail: getByEmail,
  getByUsername: getByUsername
};
