let dynamodbService = require('./dynamodbService');

function getParams (email) {
  return {
    TableName: 'WordShop',
    IndexName: 'query_key_01-updated-index',
    KeyConditionExpression: 'query_key_01 = :qk01',
    ExpressionAttributeValues: {
      ':qk01': `usr:email:${email.toLocaleLowerCase()}`
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
