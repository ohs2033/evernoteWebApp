var User = require('../model/userModel');
var express = require('express');
var router = express.Router();
var Evernote = require('evernote').Evernote;
var client = require('../../client.js').client;
var url = require('url');

var getOauthVerifier = function(url) {
        var regex = new RegExp("[\\?&]oauth_verifier=([^&#]*)"),
        results = regex.exec(url);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}



var oauth = function (req, res, next, callbackUrl) {	
		  var callback = callbackUrl;
		  client.getRequestToken(callback, function(err, oauthToken, oauthSecret, results){
		    if(err) {
		      console.log(err);
		    }
		    else {
		      req.session.oauthToken = oauthToken;
		      req.session.oauthSecret = oauthSecret;
		      console.log("set oauth token and secret");
		      var authorizeUrl = client.getAuthorizeUrl(oauthToken);
		      res.redirect(authorizeUrl);
		    }
		});
}

module.exports = {
	
	signin: function (req, res, next) {
		console.log('sign in..');
		if(req.session.oauthToken){
			//after get authtoken.
			var parsedUrl = url.parse(req.url);

			client.getAccessToken(
			  req.session.oauthToken, 
			  req.session.oauthSecret, 
			  getOauthVerifier(parsedUrl.search), 
			  function(error, oauthAccessToken, oauthAccessTokenSecret, results) {
			    if(error) {
			      console.log("error\n\n\n");
			      console.log(error);
			    }	
			    else {
			      var accessedClient = new Evernote.Client({
			      	token: oauthAccessToken,
			      	sandbox:true
			      })
			      var userStore = accessedClient.getUserStore();
			      userStore.getUser( function (err, user){
			      	if(err) console.error(err);
			      	console.log('start finding user with:',user.id);
			      	User.find({
			      		id: user.id
			      	},
			      		function(err, result){
			      			if(err) return console.error(err);
			      			
			      			else if(result.length>0) {
			      				console.log('the result is..', result);
			      				req.session.accessToken = oauthAccessToken;
			      				res.redirect('/aps');// **this needs to be jwtted.	
			      			}else{
			      				res.end('no user. please sign up')
			      			}
			      		}
			      	)
			      })
				} 
			  }
			);
			//signin.
		}else{
			oauth(req, res, next, 'http://localhost:3000/api/users/signin');
		}
	
	},
	signup: function (req, res, next) {

		if(req.session.oauthToken){
			var parsedUrl = url.parse(req.url);
			client.getAccessToken( //get AccessToken with OAuth token.
			  req.session.oauthToken, 
			  req.session.oauthSecret, 
			  getOauthVerifier(parsedUrl.search), 
			  function(error, oauthAccessToken, oauthAccessTokenSecret, results) {
			    if(error) {
			      console.log("ERROR:");
			      console.log(error);
			    }
			    else {
			      console.log('successfully get an access token.');
			      var accessedClient = new Evernote.Client({
			      	token: oauthAccessToken,
			      	sandbox:true
			      })
			      
			      //** session save.**//
			      req.session.accessToken = oauthAccessToken;



			      var userStore = accessedClient.getUserStore();
			      var noteStore = accessedClient.getNoteStore();


			      	var filter = new Evernote.NoteFilter();
			      	filter.words = "updated:day-7"
			      	console.log('filter is..',filter);


			      	var resultSpec = new Evernote.NotesMetadataResultSpec();
			      	resultSpec.includeTitle = true;
			      	resultSpec.includeContentLength = true;
			      	resultSpec.includeCreated = true;
			      	resultSpec.includeAttributes = true;
			      	resultSpec.includeUpdated = true;
			      	
			      	//get Note Data
			      	noteStore.findNotesMetadata(filter, 0, 100, resultSpec, function(err, notesMeta) {

			      	    if (err) {
			      	      console.error('err',err);
			      	    }
			      	    else {
			      	      console.log("Found "+notesMeta.notes.length+" notes.");
			      	      var noteGuids = [];
			      	      for (var i in notesMeta.notes) {

			      	      console.log(notesMeta.notes[i].title);
			      	      noteGuids.push(notesMeta.notes[i]['guid']);
			      	       // var note = noteStore.getNote(
			      	       //    noteGuid,
			      	       //    true, true, true, true,

			      	       //    function(err, results){

			      	       //      if(err) return console.error("Error")
			      	       //      console.log(results);
			      	       //      response.end();
			      	       //  })                      
			      	      }
			      	      userStore.getUser( function (err, user){
			      	      	//** got user id
			      	      	req.session.uid = user.id;

			      	      	if(err)  return console.log(err);
			      	      	User.find({
			      	      		id: user.id
			      	      	},
			      	      		function(err, result){
			      	      			if(err) return console.error(err);
			      	      			else if(result.length>0) {

			      	      				console.log('already signed up..', result);
			      	      				res.redirect('/api/notes/renew');;// **this needs to be jwtted.	
			      	      			}else{

			      	      				console.log('creating users..');
			      	      				new User({
			      	      					id: user.id,
			      	      					listNotes: noteGuids
			      	      				}).save(function(err, result){
			      	      					if(err) return console.error(err);
			      	      					console.log('successfully saved.');
			      	      					res.redirect('/api/notes/create')
			      	      			})
			      	      		}
			      	      	})
			      	      })//getUser
			      	    }
			      	});
			      	//get Note Data
			      	//get User Data.
				} 
			  }
			);

		}else{
			oauth(req, res, next, 'http://localhost:3000/api/users/signup');
		}

	},
	signout: function (req, res, next){
		req.session.oauthToken = null;
		req.session.oauthSecret = null;
		req.session.accessToken = null;
		res.redirect('/');

	},
	checkAuth: function (req, res, next) {

	}
}


