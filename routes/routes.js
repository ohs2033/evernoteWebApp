var noteController = require('./controller/noteController.js');
var userController = require('./controller/userController.js');

module.exports = function(app, express) {
  //라우터 설정을 해주는 것을 함수화 해줌.
  app.use('/', function(req, res, next) {
    //아직 로그인을 하기 전 메인 페이지.
    if (req.url === '/') {
      res.redirect('/mainpage')
    }
    next();
  })

  //로그인 페이지
  app.get('/login', function(req, res, next) {
    //로그인 페이지에서는 링크를 보내줌. AJAX콜로는 Oauth를 수행할 수 없기 때문에 링크를 타고 에버노트 페이지로 가야 함!
    res.end('<div><a href= "/api/users/signin"> signin</a></div>\n<div><a href= "/api/users/signup"> signup</a></div>');
  })

  app.post('/api/notes/finish', noteController.notePhaseUp);
  app.get('/api/notes/create', noteController.noteStoring);
  app.get('/api/notes/renew', noteController.renewPhase);
  app.get('/api/notes/:id', noteController.openOneNote);

  app.get('/api/users/signin', userController.signin);
  app.get('/api/users/signout', userController.signout);
  app.get('/api/users/signup', userController.signup);
  app.get('/api/users/signedin', userController.checkAuth);

  app.get('/rest/note/get', noteController.getNote);
};
