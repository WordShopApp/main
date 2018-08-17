module.exports = (app) => {

  // account
  let accountController = require('../controllers/accountController');
  app.post('/profile', accountController.profileCreate);
  app.put('/profile', accountController.profileUpdate);
  app.get('/profile', accountController.profileShow);
  app.get('/profile/validate-username/:username', accountController.usernameValidate);
  app.delete('/profile', accountController.profileDelete);

  // project
  let projectController = require('../controllers/projectController');
  app.post('/projects', projectController.projectCreate);
  app.get('/projects/mine', projectController.projectMine);
  app.get('/projects/:project_id', projectController.projectShow);
  app.put('/projects/:project_id', projectController.projectUpdate);
  app.delete('/projects', projectController.projectDelete);

  // user
  let userController = require('../controllers/userController');
  app.get('/users/:id', userController.show);

  // root
  let appController = require('../controllers/appController');
  app.get('/', appController.status);

};
