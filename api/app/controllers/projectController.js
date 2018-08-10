const http = require('../services/utils');
const projectService = require('../services/projectService');
const userService = require('../services/userService');

function handleException (err, res, desc) {
  if (err.code === 'AccessDeniedException') {
    console.log(desc, 'unauthorized', err);
    res.status(http.codes.unauthorized).send({ 
      message: 'unauthorizied' 
    });
  } else {
    console.log(desc, 'internal_server_error', err);
    res.status(http.codes.internal_server_error).send({ 
      message: 'internal_server_error' 
    });
  }
}

module.exports.projectCreate = (req, res) => {

  let desc = 'POST /projects';

  userService.get(req.user).then(user => {

    let newProjData = req.body;
    console.log(desc, 'newProjData', newProjData);

    projectService.add(user, newProjData).then(proj => {

      console.log(desc, 'created', proj);
      res.status(http.codes.created).send(proj);
  
    }).catch(err => {
      handleException(err, res, desc);
    });

  }).catch(err => {
    handleException(err, res, desc);
  });

};

module.exports.projectMine = (req, res) => {
  let desc = 'GET /projects/mine';

  userService.get(req.user).then(user => {

    projectService.all(user.user_id).then(projs => {

      console.log(desc, 'projects', projs);
      res.status(http.codes.ok).send(projs);
  
    }).catch(err => {
      handleException(err, res, desc);
    });

  }).catch(err => {
    handleException(err, res, desc);
  });
};

module.exports.projectShow = (req, res) => {
};

module.exports.projectUpdate = (req, res) => {
};

module.exports.projectDelete = (req, res) => {
};
