var express = require('express');
var router = express.Router();
var client = require('../client.js').client;
var Evernote = require('evernote').Evernote;
var gb = require('../client.js').gb;
var url = require('url')

var enml = require('enml-js')


function getOauthVerifier(url) {
  var regex = new RegExp("[\\?&]oauth_verifier=([^&#]*)"),
    results = regex.exec(url);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

router.get('/', function(request, response) {
  var parsedUrl = url.parse(request.url);
  console.log('search is:' + parsedUrl.search)
  client.getAccessToken(
    request.session.oauthToken,
    request.session.oauthSecret,
    getOauthVerifier(parsedUrl.search),
    function(error, oauthAccessToken, oauthAccessTokenSecret, results) {
      if (error) {
        console.log("error\n\n\n");
        console.log(error);
      } else {
        console.log('successfully get an access token.');
        var accessedClient = new Evernote.Client({
          token: oauthAccessToken,
          sandbox: true
        })
        var userStore = accessedClient.getUserStore();
        userStore.getUser(function(err, user) {
          console.log(err);

          response.end(JSON.stringify(user));
        })
      }
    }
  );
})


module.exports = router;
