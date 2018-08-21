const http = require('../services/utils');
const critiqueService = require('../services/critiqueService');
const projectService = require('../services/projectService');
const userService = require('../services/userService');
const presenterService = require('../services/presenterService');

function handleException (err, res, desc) {
  if (err.code === 'AccessDeniedException') {
    console.log(desc, 'Unauthorizied', err);
    res.status(http.codes.unauthorized).send({ message: 'unauthorizied' });
  } else if (err.code === 'ResourceNotFoundException') {
    console.log(desc, 'Does Not Exist', err);
    res.status(http.codes.not_found).send({ message: 'does_not_exist' });
  } else {
    console.log(desc, 'Internal Server Error', err);
    res.status(http.codes.internal_server_error).send({ message: 'internal_server_error' });
  }
}

module.exports.init = (req, res) => {
  let desc = 'GET /views/init';
  console.log(desc, 'User', req.user.user_id);

  // 1) set profile to current user
  let data = { profile: req.user };

  // 2) next get projects and critiques for current user
  let pp = projectService.all(req.user.user_id);
  let cp = critiqueService.all(req.user.user_id);
  Promise.all([pp, cp]).then(results => {
    data.projects = results[0];
    data.critiques = results[1];
    console.log(desc, 'Data', data);

    // 2) send response
    res.status(http.codes.ok).send(data);
  }).catch(err => {
    handleException(err, res, desc);
  });
};

module.exports.profile = (req, res) => {
  let desc = 'GET /views/profile';
  console.log(desc, 'Username', req.params.username);

  // 1) first get user by username
  let data = {};
  userService.getByUsername(req.params.username).then(user => {
    data.user = presenterService.profileUser(user);

    // 2) next get projects and critiques by user_id
    let pp = projectService.all(user.user_id);
    let cp = critiqueService.all(user.user_id);
    Promise.all([pp, cp]).then(results => {
      data.projects = results[0];
      data.critiques = results[1];

      // 3) send response
      console.log(desc, 'Data', data);
      res.status(http.codes.ok).send(data);
    }).catch(err => {
      handleException(err, res, desc);
    });
  }).catch(err => {
    handleException(err, res, desc);
  });
};

module.exports.project = (req, res) => {
  let desc = 'GET /views/project';
  console.log(desc, 'ProjectId', req.params.project_id);

  // 1) first get project and critiques by project_id
  let data = {};
  let pp = projectService.get(req.params.project_id, true);
  let cp = critiqueService.allByProjectId(req.params.project_id);
  Promise.all([pp, cp]).then(results => {
    data.project = results[0];
    data.critiques = results[1];

    // 2) next get user
    userService.get(data.project.user_id).then(user => {
      data.user = user;

     // 3) send response
     console.log(desc, 'Data', data);
     res.status(http.codes.ok).send(data);
    }).catch(err => {
      handleException(err, res, desc);
    });
  }).catch(err => {
    handleException(err, res, desc);
  });
};
