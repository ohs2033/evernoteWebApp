var express = require('express');
var router = express.Router();
var hostName = "https://sandbox.evernote.com";


var Evernote = require('evernote').Evernote;
router.get('/', function(req, res, next){
	var client = new Evernote.Client({
	  consumerKey: 'hso',
	  consumerSecret: 'c2e866da5f2a43c9' // Optional (default: true)
	});
	client.getRequestToken('YOUR CALLBACK URL', function(error, oauthToken, oauthTokenSecret, results) {
		console.log(arguments);
		// var client = new Evernote.Client({
		// 	consumerKey: 'hso',
		// 	consumerSecret: 'c2e866da5f2a43c9',
		// 	token: oauthToken,
		// 	// secret: oauthTokenSecret
		// });
		// console.log(client);
		// var noteStore = client.getNoteStore();
		// noteStore.listNotebooks(function(err, notebooks) {
		//   console.log(err);
		//   console.log(notebooks);
		  
		// });
		res.redirect('/OAuth.action?oauth_token='+oauthToken)
	});
})

// var EvernoteStrategy = require('passport-oauth').OAuthStrategy;
// var EvernoteStrategy = require('passport-evernote');
// var passport = require('passport');
// new EvernoteStrategy(
// {	requestTokenURL: 'https://sandbox.evernote.com/oauth',
// 	accessTokenURL: 'https://sandbox.evernote.com/oauth',
// 	consumerKey: 'hso',
// 	consumerSecret: 'c2e866da5f2a43c9'
// },function (err){
// 	if(err) console.log(err);
// 	console.log('the arguments are ', arguments);
// })

// /* GET users listing. */
// router.get('/', function(req, res, next) {
// module.exports = router;
// passport.use(new EvernoteStrategy({
// 		requestTokenURL: 'https://sandbox.evernote.com/oauth',
// 		accessTokenURL: 'https://sandbox.evernote.com/oauth',
// 		userAuthorizationURL: 'https://sandbox.evernote.com/OAuth.action',
// 	    consumerKey: 'hso',
// 	    consumerSecret: 'c2e866da5f2a43c9',
// 	    callbackURL: 'http://localhost:3000/'
//   },
//   function(token, tokenSecret, profile, cb) {
//     User.findOrCreate({ evernoteId: profile.id }, function (err, user) {
//       console.log(err,user);
//       return cb(err, user);
//     });
//   }
// ));


// });

module.exports = router;


// passport.use(new EvernoteStrategy({
// 	requestTokenURL: 'https://sandbox.evernote.com/oauth',
// 	accessTokenURL: 'https://sandbox.evernote.com/oauth',
// 	userAuthorizationURL: 'https://sandbox.evernote.com/OAuth.action',
//     consumerKey: 'hso',
//     consumerSecret: 'c2e866da5f2a43c9'
//     // callbackURL: "http://127.0.0.1:3000/auth/evernote/callback"
//   },
//   function(token, tokenSecret, profile, cb) {
//   	console.log('1')
//     User.findOrCreate({ evernoteId: profile.id }, function (err, user) {
//       console.log(err,user);
//       return cb(err, user);
//     });
//   })
//  )

