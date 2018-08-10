const AWS = require('aws-sdk');

// http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html
function dynamodbDocumentClient () {
  return new AWS.DynamoDB.DocumentClient({
    region: 'us-east-1',
    apiVersion: '2012-08-10'
  });
}

function getItem (queryParams) {
  return new Promise(function (resolve, reject) {
    // http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#query-property
    dynamodbDocumentClient().query(queryParams, function (err, res) {
      if (err) return reject(err);

      var item = res && res.Items && res.Items[0];
      if (!item) return reject({ code: 'ResourceNotFoundException' });

      resolve(item);
    });
  });
}

function addItem (params) {
  return new Promise(function (resolve, reject) {
    // http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#put-property
    dynamodbDocumentClient().put(params, function (err, res) {
      if (err) return reject(err);
      resolve(res);
    });
  });
}

function addBatch (params) {
  return new Promise(function (resolve, reject) {
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#batchWrite-property
    dynamodbDocumentClient().batchWrite(params, function (err, res) {
      if (err) return reject(err);
      resolve(res);
    });
  });
}

function delItem (params) {
  return new Promise(function (resolve, reject) {
    // http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#delete-property
    dynamodbDocumentClient().delete(params, function (err, res) {
      if (err) return reject(err);
      resolve(res);
    });
  });
}

module.exports = {
  addBatch: addBatch,
  addItem: addItem,
  getItem: getItem,
  delItem: delItem
};
