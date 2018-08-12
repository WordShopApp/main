let dynamodbService = require('./dynamodbService');

function getParams (email) {
  return {
    TableName: 'WordShop',
    KeyConditionExpression: 'ws_key = :wskey',
    ExpressionAttributeValues: {
      ':wskey': `usr:${email}`
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
