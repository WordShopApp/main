// let projectService = require('./app/services/projectService');
const s3Service = require('./app/services/s3Service');

/*
let userId = 'LD89EmGKEb';
let projectId = 'rwn7BT2bW';
projectService.get(projectId).then(res => {
  console.log('success', res);
}).catch(err => {
  console.log('error', err);
});
*/

var params = {
  Bucket: "store.wordshop.app", 
  Key: "usr:LD89EmGKEb/prj:-3zu_YH1d/prt:_UCeJwwr8H/ver:9ABVbd5uKo"
 };
 s3Service.get(params).then(data => {
   console.log('success', data);
 }).catch(err => {
   console.log('error', err);
 });