const http = require('../services/utils');
const critiqueService = require('../services/critiqueService');
const projectService = require('../services/projectService');

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

module.exports.init = (req, res) => {
  let desc = 'GET /views/init';
  console.log(desc, 'User', req.user.user_id);
  let data = { profile: req.user };
  let pp = projectService.all(req.user.user_id);
  let cp = critiqueService.all(req.user.user_id);
  Promise.all([pp, cp]).then(results => {
    data.projects = results[0];
    data.critiques = results[1];
    console.log(desc, 'Data', data);
    res.status(http.codes.ok).send(data);
  }).catch(err => {
    handleException(err, res, desc);
  });
};

module.exports.profile = (req, res) => {
  // fetch *public* profile, projects, and critiques for req.params.username
};

module.exports.project = (req, res) => {
  // fetch project, critiques, and user for req.params.project_id
};
