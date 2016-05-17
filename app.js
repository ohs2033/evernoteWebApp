var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var users = require('./routes/users');
var oauth = require('./routes/oauth');

var mongoose = require('mongoose');

var router = require('./routes/routes.js')
var session = require('express-session');

var app = express();

//mognodb connection
var mongoURI = "mongodb://localhost/evernote";
var MongoDB = mongoose.connect(mongoURI).connection;
MongoDB.on('error', function(err) { console.error('ERROR:',err.message); });
MongoDB.once('open', function() {
  console.log("mongodb connection open");
});




app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
// view engine setup

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next){
   console.log("CORS config..")
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   res.header("Access-Control-Expose-Headers", "tokens")
   next();
});


app.use(session({
  secret: 'keyboard cat',
  resave: true, //focus sessions to be saved session store during the request
  saveUninitialized: true
}))


app.use('/mainpage', function(req, res, next){
   console.log('token in mainpage ', req.session)
    if(req.session.accessToken){
      console.log('got access token for static page');
      next();
    }else{
      console.log('no access token.');
      res.redirect('/login')
    }//first middleware
  }, express.static(path.join(__dirname, 'public'))
)




// app.use('/users', routes);
// app.use('/oauth', oauth);

// app.use('/signin',);
// app.use('/signup',)
router(app, express);
// 

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
  if(err) {
    console.error(err);
    res.status(err.status || 500);
    res.end(err);
  }
});


module.exports = app;
