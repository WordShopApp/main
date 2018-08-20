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

module.exports.dashboard = (req, res) => {
};

module.exports.profile = (req, res) => {
};

module.exports.project = (req, res) => {
};
