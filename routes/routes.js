var noteController = require('./controller/noteController.js');
var userController = require('./controller/userController.js');

module.exports = function (app, express) {
  app.post('/api/notes/finish', noteController.notePhaseUp);
  app.post('/api/notes/create', noteController.noteStoring);
  app.post('/api/notes/renew', noteController.renewPhase);
  app.get('/api/notes/:id', noteController.openOneNote);

  app.get('/api/users/signin', userController.signin);
  app.get('/api/users/signout', userController.signout);
  app.get('/api/users/signup', userController.signup);
  app.get('/api/users/signedin', userController.checkAuth);

  // authentication middleware used to decode token and made available on the request
  // app.use('/api/links', helpers.decode);
  // If a request is sent somewhere other than the routes above,
  // send it through our custom error handler
};
