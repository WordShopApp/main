const http = require('../services/utils');
const critiqueService = require('../services/critiqueService');

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

module.exports.critiqueCreate = (req, res) => {
  let desc = 'POST /critiques';
  let newCritData = req.body;
  console.log(desc, 'newCritData', newCritData);
  critiqueService.add(req.user, newCritData).then(crit => {
    console.log(desc, 'Created', crit);
    res.status(http.codes.created).send(crit);
  }).catch(err => {
    handleException(err, res, desc);
  });
};