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
  app.put('/projects/:project_id/text', projectController.projectUpdateText);
  app.delete('/projects/:project_id', projectController.projectDelete);

  // critiques
  let critiqueController = require('../controllers/critiqueController');
  app.post('/critiques', critiqueController.critiqueCreate);

  // user
  let userController = require('../controllers/userController');
  app.get('/users/:id', userController.show);

  // views
  let viewController = require('../controllers/viewController');
  app.get('/views/init', viewController.init);
  app.get('/views/project/:project_id', viewController.project);
  app.get('/@:username', viewController.profile);

  // root
  let appController = require('../controllers/appController');
  app.get('/', appController.status);

};
