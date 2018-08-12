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

function getProjectParams (projectId) {
  return {
    TableName: 'WordShop',
    Key: {
      'ws_key': `prj:${projectId}`
    }
  }
}

function getProjectPartsParams (projectId) {
  return {
    TableName: 'WordShop',
    IndexName: 'query_key_01-updated-index',
    KeyConditionExpression: 'query_key_01 = :qk01',
    ExpressionAttributeValues: {
      ':qk01': `prt:prj:${projectId}`
    },
    ScanIndexForward: false
  };
}

function getProjectVersionsParams (projectId) {
  return {
    TableName: 'WordShop',
    IndexName: 'query_key_01-updated-index',
    KeyConditionExpression: 'query_key_01 = :qk01',
    ExpressionAttributeValues: {
      ':qk01': `ver:prj:${projectId}`
    },
    ScanIndexForward: false
  };
}

function allProjectsParams (userId) {
  return {
    TableName: 'WordShop',
    IndexName: 'query_key_01-updated-index',
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
      .then(resolve)
      .catch(reject);
  });
}

function all (userId) {
  return new Promise((resolve, reject) => {
    dynamodbService
      .getItems(allProjectsParams(userId))
      .then(resolve)
      .catch(reject);
  });
}

function formatProjectResults (results) {
  let project = results[0];
  let parts = results[1];
  let versions = results[2];
  for (let v = 0; v < versions.length; v += 1) {
    let ver = versions[v];
    for (let p = 0; p < parts.length; p += 1) {
      let prt = parts[p];
      if (prt.part_id === ver.part_id) {
        if (!prt.versions) prt.versions = [];
        prt.versions.push(ver);
      }
    }
  }
  project.parts = parts;
  return project;
}

function get (projectId) {
  return new Promise((resolve, reject) => {
    let prjp = dynamodbService.getSingleItem(getProjectParams(projectId));
    let prtp = dynamodbService.getItems(getProjectPartsParams(projectId));
    let verp = dynamodbService.getItems(getProjectVersionsParams(projectId));
    Promise.all([prjp, prtp, verp]).then(res => {
      resolve(formatProjectResults(res));
    }).catch(reject);
  });
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