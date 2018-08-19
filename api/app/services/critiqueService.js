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
      created: now,
      updated: now,
      query_key_01: `crt:usr:${user.user_id}`,
      query_key_02: `crt:prj:${data.project_id}`,
      query_key_03: `crt:prj:${data.project_id}:prt:${data.part_id}`,
      query_key_04: `crt:prj:${data.project_id}:prt:${data.part_id}:ver:${data.version_id}`,
    }
  };
}

function add (user, data) {
  return new Promise((resolve, reject) => {
    let critParams = newCritParams(user, data);
    dynamodbService
      .addItem(critParams)
      .then(resolve)
      .catch(reject);
  });
}

module.exports = {
  add: add
};