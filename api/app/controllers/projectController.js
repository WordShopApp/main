const http = require('../services/utils');
const projectService = require('../services/projectService');
const s3Service = require('../services/s3Service');

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

function deleteImageParams (key) {
  return {
    Bucket: 'store.wordshop.app',
    Delete: {
      Objects: [
        {
          Key: key.replace('{{size}}', 400)
        },
        {
          Key: key.replace('{{size}}', 200)
        },
        {
          Key: key.replace('{{size}}', 100)
        },
        {
          Key: key.replace('{{size}}', 50)
        }
      ]
    }
  };
}

function hasImageUpdate (req) {
  return Object.keys(req.body).indexOf('image') > -1;
}

function removeOldImages(desc, imageKey) {
  if (imageKey) {
    s3Service.del(deleteImageParams(imageKey)).then(res => {
      console.log(desc, 'Success Removing Images', res);
    }).catch(err => {
      console.log(desc, 'Error Removing Images', imageKey);
    });
  }
}

function userCreatedProject (userId, projectUserId) {
  return userId === projectUserId ? true : false;
}

module.exports.projectCreate = (req, res) => {
  let desc = 'POST /projects';
  let newProjData = req.body;
  console.log(desc, 'newProjData', newProjData);
  projectService.add(req.user, newProjData).then(proj => {
    console.log(desc, 'Created', proj);
    res.status(http.codes.created).send(proj);
  }).catch(err => {
    handleException(err, res, desc);
  });
};

module.exports.projectMine = (req, res) => {
  let desc = 'GET /projects/mine';
  projectService.all(req.user.user_id).then(projs => {
    console.log(desc, 'Projects', projs);
    res.status(http.codes.ok).send(projs);
  }).catch(err => {
    handleException(err, res, desc);
  });
};

module.exports.projectShow = (req, res) => {
  let desc = `GET /projects/${req.params.project_id}`;
  projectService.get(req.params.project_id).then(proj => {
    console.log(desc, 'Project', proj);
    res.status(http.codes.ok).send(proj);
  }).catch(err => {
    handleException(err, res, desc);
  });
};

module.exports.projectUpdate = (req, res) => {
  let projId = req.params.project_id;
  let desc = `PUT /projects/${projId}`;

  // 1) get project to update
  projectService.get(projId, true).then(proj => {

    if (!userCreatedProject(req.user.user_id, proj.user_id)) {
      return res.status(http.codes.unauthorized).send({ 
        message: 'You may only update your own projects' 
      });
    }

    if (hasImageUpdate(req)) {
      let oldImageKey = proj.image;
      console.log(desc, 'Old Image Key', oldImageKey);
      removeOldImages(desc, oldImageKey);
    }

    console.log(desc, 'Existing', proj);

    // 2) update project with new data
    let updated = { ...proj, ...req.body };
    projectService.put(updated).then(p => {

      console.log(desc, 'Updated', p);

      // 3) respond with updated project
      res.status(http.codes.ok).send(p);

    }).catch(err => {
      handleException(err, res, desc);
    });

  }).catch(err => {
    handleException(err, res, desc);
  });
};

module.exports.projectDelete = (req, res) => {
  let projId = req.params.project_id;
  let desc = `DELETE /projects/${projId}`;

  // 1) get project to delete
  projectService.get(projId, true).then(proj => {

    console.log(desc, 'Found', proj);

    if (!userCreatedProject(req.user.user_id, proj.user_id)) {
      return res.status(http.codes.unauthorized).send({ 
        message: 'You may only delete your own projects' 
      });
    }

    // 2) delete project by id
    projectService.del(projId).then(res => {

      console.log(desc, 'Deleted', proj);

      // 3) send ok response
      res.status(http.codes.ok).send(proj);

    }).catch(err => {
      handleException(err, res, desc);
    });

  }).catch(err => {
    handleException(err, res, desc);
  });
};
