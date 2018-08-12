let projectService = require('./app/services/projectService');

let userId = 'LD89EmGKEb';
let projectId = 'rwn7BT2bW';
projectService.get(projectId).then(res => {
  console.log('success', res);
}).catch(err => {
  console.log('error', err);
});