var express = require('express');
var router = express.Router();
var Evernote = require('evernote').Evernote;
var client = require('../client.js').client;
// var gb = require('../client.js').gb
/* GET home page. */
router.get('/', function(request, response, next) {
	console.log('user Aouth Login route.');
	debugger;
	  var callbackUrl = 'http://localhost:3000/oauth';
	  client.getRequestToken(callbackUrl, function(err, oauthToken, oauthSecret, results){
	    if(err) {
	      console.log(err);
	    }
	    else {
	      request.session.oauthToken = oauthToken;
	      request.session.oauthSecret = oauthSecret;
	      console.log("set oauth token and secret");
	      var authorizeUrl = client.getAuthorizeUrl(oauthToken);
	      console.log(client.getAuthorizeUrl.toString())
	      console.log(authorizeUrl);
	      response.redirect(authorizeUrl);
	    }

	  });
});

module.exports = router;
