const moment = require('moment');
const shortid = require('shortid');

const dynamodbService = require('./dynamodbService');

function genTimestamp () {
  // http://momentjs.com/docs/#/displaying/unix-timestamp-milliseconds/
  return moment().valueOf();
}

function genShortId () {
  // https://github.com/dylang/shortid
  return shortid.generate();
}

function tableName () {
  return 'WordShop';
}

function newCritParams (user, data) {
  let critId = genShortId();
  let now = genTimestamp();
  return {
    TableName: tableName(),
    Item: {
      ws_key: `crt:${critId}`,
      project_id: data.project_id,
      part_id: data.part_id,
      version_id: data.version_id,
      user_id: user.user_id,
      items: data.items,
      unread: true,
      created: now,
      updated: now,
      query_key_01: `crt:usr:${user.user_id}`,
      query_key_02: `crt:prj:${data.project_id}`,
      query_key_03: `crt:prj:${data.project_id}:prt:${data.part_id}`,
      query_key_04: `crt:prj:${data.project_id}:prt:${data.part_id}:ver:${data.version_id}`,
    }
  };
}

function allCritsParams (userId) {
  return {
    TableName: 'WordShop',
    IndexName: 'query_key_01-updated-index',
    KeyConditionExpression: 'query_key_01 = :qk01',
    ExpressionAttributeValues: {
      ':qk01': `crt:usr:${userId}`
    },
    ScanIndexForward: false
  };
}


function add (user, data) {
  return new Promise((resolve, reject) => {
    dynamodbService
      .addItem(newCritParams(user, data))
      .then(resolve)
      .catch(reject);
  });
}

function all (userId) {
  return new Promise((resolve, reject) => {
    dynamodbService
      .getItems(allCritsParams(userId))
      .then(resolve)
      .catch(reject);
  });
}

module.exports = {
  add: add
};