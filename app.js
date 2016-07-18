var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// var routes = require('./routes/index');
// var oauth = require('./routes/oauth');

var mongoose = require('mongoose');

var router = require('./routes/routes.js')
var session = require('express-session');

var app = express();

//mognodb connection
var mongoURI = "mongodb://localhost/evernote";
var MongoDB = mongoose.connect(mongoURI).connection;
MongoDB.on('error', function(err) { console.error('ERROR:', err.message); });
MongoDB.once('open', function() {
  console.log("mongodb connection open");
});



// 뷰 엔진을 지정해주지 않으면 오류가 뜸.(제이드는 실제로 사용하지 않는다.)
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
// view engine setup

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


//CROSS_ORIGIN 헤더를 설정해주는 부분.
app.use(function(req, res, next) {
  console.log("CORS config..")
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Expose-Headers", "tokens")
  next();
});


//세션 시크릿과 resave를 지정해주는 부분.
app.use(session({
  secret: 'keyboard cat',
  resave: true, //focus sessions to be saved session store during the request
  saveUninitialized: true
}))

// Angular 페이지를 제공해주는 부분 . 
// 메인페이지라는 주소로 리다이렉트가 될 때, 토큰이 있지 않으면 로그인을 하도록 함.(토큰이 있을 때에는 토큰으로부터 유저 데이터를 다시 가져옴)
app.use('/mainpage', function(req, res, next) {
  console.log(' > token is valid \n : ', req.session)
  if (req.session.accessToken) {
    console.log(' > valid access token for static page');
    next();
  } else {
    console.log(' > no access token.');
    res.redirect('/login')
  }
}, express.static(path.join(__dirname, 'public')))



// Restful api 라우터 설정이 들어가는 부분. 
router(app, express);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// if (app.get('env') === 'development') {
//   app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.redirect('/error');
//   });
// }
app.use(function(err, req, res, next) {
  if (err) {
    console.error(err);
    res.status(err.status || 500);
    res.end(JSON.stringify(err));
  }
});


module.exports = app;
