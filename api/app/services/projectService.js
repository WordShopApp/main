const moment = require('moment');
const shortid = require('shortid');

let dynamodbService = require('./dynamodbService');

function genTimestamp () {
  // http://momentjs.com/docs/#/displaying/unix-timestamp-milliseconds/
  return moment().valueOf();
}

function genShortId () {
  // https://github.com/dylang/shortid
  return shortid.generate();
}

function allProjectsParams (userId) {
  return {
    TableName: 'WordShop',
    KeyConditionExpression: 'query_key_01 = :qk01',
    ExpressionAttributeValues: {
      ':qk01': `prj:usr:${userId}`
    },
    ScanIndexForward: false
  };
}

function newProjBatchParams (params) {
  let now = genTimestamp();
  let projectId = genShortId();
  let partId = genShortId();
  let versionId = genShortId();
  return {
    RequestItems: {
      'WordShop': [
        {
          PutRequest: {
            Item: {
              ws_key: `prj:${projectId}`,
              project_id: projectId,
              user_id: params.userId,
              title: params.title,
              categories: params.categories,
              private: params.private,
              created: now,
              updated: now,
              query_key_01: `prj:usr:${params.userId}`
            }
          }
        },
        {
          PutRequest: {
            Item: {
              ws_key: `prt:${partId}`,
              part_id: partId,
              project_id: projectId,
              part_name: params.partName,
              context: params.context,
              questions: params.questions,
              created: now,
              updated: now,
              query_key_01: `prt:prj:${projectId}`
            }
          }
        },
        {
          PutRequest: {
            Item: {
              ws_key: `ver:${versionId}`,
              version_id: versionId,
              part_id: partId,
              project_id: projectId,
              text: params.text,
              word_count: params.wordCount,
              created: now,
              updated: now,
              query_key_01: `ver:prj:${projectId}`,
              query_key_02: `ver:prt:${partId}`
            }
          }
        }
      ]
    }
  };
}

function newProjParams (user, data) {
  return newProjBatchParams({
    userId: user.user_id,
    title: data[0].title,
    partName: data[1].part_name,
    text: data[2].text,
    wordCount: data[2].word_count,
    context: data[3].context,
    categories: [
      data[4].main_category, 
      data[4].adult_category
    ].concat(data[4].categories),
    questions: data[5].questions,
    private: data[6].private
  });
}

function newProjBatchParamsToResults (params) {
  let proj = params.RequestItems.ws_projects[0].PutRequest.Item;
  let part = params.RequestItems.ws_parts[0].PutRequest.Item;
  let ver = params.RequestItems.ws_versions[0].PutRequest.Item;
  part.versions = [ver];
  proj.parts = [part];
  return proj;
}

function add (user, data) {
  return new Promise((resolve, reject) => {
    let npp = newProjParams(user, data);
    dynamodbService
      .addBatch(npp)
      .then(res => {
        // todo: check for items in res.UnprocessedItems
        resolve(newProjBatchParamsToResults(npp));
      })
      .catch(reject);
  });
}

function all (userId) {
  return new Promise((resolve, reject) => {
    dynamodbService
      .getItems(allProjectsParams(userId))
      .then(res => {
        resolve(res);
      })
      .catch(reject);
  });
}

function get (id) {

}

function put (id, data) {

}

function del (id) {

}

module.exports = {
  add: add,
  all: all,
  get: get,
  put: put,
  del: del
};