const serverless = require('serverless-http');
const app = require('./app/main');

module.exports.handler = serverless(app);
