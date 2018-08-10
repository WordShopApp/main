let dynamodbService = require('./dynamodbService');

function getParams (email) {
  return {
    TableName: 'ws_users',
    IndexName: 'email-index',
    KeyConditionExpression: 'email = :email',
    ExpressionAttributeValues: {
      ':email': email
    }
  };
}

function get (email) {
  return new Promise ((resolve, reject) => {
    dynamodbService
      .getItem(getParams(email))
      .then(resolve)
      .catch(reject);
  });
}

module.exports = {
  get: get
};
