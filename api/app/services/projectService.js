const moment = require('moment');
const shortid = require('shortid');

const dynamodbService = require('./dynamodbService');
const s3Service = require('./s3Service');

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

function tableName () {
  return 'WordShop';
}

function newProjItemParams (params) {
  let now = genTimestamp();
  let projectId = genShortId();
  let partId = genShortId();
  let versionId = genShortId();
  return {
    TableName: tableName(),
    Item: {
      ws_key: `prj:${projectId}`,
      project_id: projectId,
      user_id: params.userId,
      title: params.title,
      categories: params.categories,
      private: params.private,
      created: now,
      updated: now,
      parts: [ 
        {
          part_id: partId,
          part_name: params.partName,
          context: params.context,
          questions: params.questions,
          created: now,
          updated: now,
          versions: [
            {
              version_id: versionId,
              text: params.text,
              word_count: params.wordCount,
              created: now,
              updated: now
            }
          ]
        }
      ],
      query_key_01: `prj:usr:${params.userId}`
    }
  };
}

function newProjParams (user, data) {
  return newProjItemParams({
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
  let proj = params.RequestItems.WordShop[0].PutRequest.Item;
  let part = params.RequestItems.WordShop[1].PutRequest.Item;
  let ver = params.RequestItems.WordShop[2].PutRequest.Item;
  part.versions = [ver];
  proj.parts = [part];
  return proj;
}

function textUploadKey (userId, projectId, partId, versionId) {
  return `usr:${userId}/prj:${projectId}/prt:${partId}/ver:${versionId}`;
}

function textUploadBucket () {
  return 'store.wordshop.app';
}

function textUploadAcl () {
  return 'authenticated-read';
}

function textUploadParams (proj) {
  let partId = proj.parts[0].part_id;
  let verId = proj.parts[0].versions[0].version_id;
  return {
    ACL: textUploadAcl(), 
    Body: ver.text,
    Bucket: textUploadBucket(), 
    Key: textUploadKey(proj.user_id, proj.project_id, partId, verId)
   };
}

function textDownloadParams (proj, part, version) {
  return {
    Bucket: textUploadBucket(),
    Key: textUploadKey(
      proj.user_id,
      proj.project_id,
      part.part_id, 
      version.version_id
    )
   };
}

function add (user, data) {
  return new Promise((resolve, reject) => {
    let proj = newProjParams(user, data);
    dynamodbService
      .addItem(proj)
      .then(_ => {
        s3Service
          .put(textUploadParams(proj))
          .then(resolve)
          .catch(reject);
      })
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
    dynamodbService.getSingleItem(getProjectParams(projectId))
      .then(proj => {
        let part = proj.parts[0];
        let ver = part.versions[0];
        s3Service.get(textDownloadParams(proj, part, ver))
        .then(text => {
          ver.text = text;
          resolve(proj);
        }).catch(reject);
      })
      .catch(reject);
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