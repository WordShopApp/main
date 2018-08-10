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

function newProjBatchParams (params) {
  let now = genTimestamp();
  let projectId = genShortId();
  let partId = genShortId();
  let versionId = genShortId();
  return {
    RequestItems: {
      'ws_projects': [
        {
          PutRequest: {
            Item: {
              project_id: projectId,
              user_id: params.userId,
              title: params.title,
              categories: params.categories,
              private: params.private,
              created: now,
              updated: now
            }
          }
        }
      ],
      'ws_parts': [
        {
          PutRequest: {
            Item: {
              part_id: partId,
              project_id: projectId,
              part_name: params.partName,
              context: params.context,
              questions: params.questions,
              created: now,
              updated: now
            }
          }
        }
      ],
      'ws_versions': [
        {
          PutRequest: {
            Item: {
              version_id: versionId,
              part_id: partId,
              project_id: projectId,
              text: params.text,
              word_count: params.wordCount
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

function add (user, data) {
  return new Promise((resolve, reject) => {
    dynamodbService
      .addBatch(newProjParams(user, data))
      .then(resolve)
      .catch(reject);
  });
}

function get (id, includeParts, includeVersions) {

}

function put (id, data) {

}

function del (id) {

}

module.exports = {
  add: add,
  get: get,
  put: put,
  del: del
};