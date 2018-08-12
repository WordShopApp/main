const AWS = require('aws-sdk');

function s3Client () {
  return new AWS.S3({
    apiVersion: '2006-03-01',
    region: 'us-east-1'
  });
}

function put (params) {
  return new Promise((resolve, reject) => {
    s3Client().putObject(params, (err, data) => {
      if (err) return reject(err)
      resolve(data);
    });
  });
}

module.exports = {
  put: put
};