var User = require('../model/userModel');
var express = require('express');
var router = express.Router();
var Evernote = require('evernote').Evernote;
var client = require('../../client.js').client;
var url = require('url');


module.exports = {
  signin: function(req, res, next) {
    console.log(' > Sign-in-process starts with oauth token.');

    if (!req.session.oauthToken) {
      return oauth(req, res, next, 'http://localhost:3000/api/users/signin');
    }
    //after get authtoken.
    var parsedUrl = url.parse(req.url);
    var getAccessTokenCallback = function(error, oauthAccessToken, oauthAccessTokenSecret, results) {
        if (error) {
          console.log(" > Error occur while getting access token.", error);
        } else {
          //성공적으로 access 토큰을 얻었다면, 이것으로 유저 개인정보에 접근할 수 있는 client를 생성한다.
          var accessedClient = new Evernote.Client({
            //sandbox: true라는 것은, 이것이 테스트용 앱이기 때문에 샌드박스의 더미데이터를 사용한다는 것을 의미.
            token: oauthAccessToken,
            sandbox: true
          })
          var userStore = accessedClient.getUserStore();
          userStore.getUser(function(err, user) {
            if (err) {
              console.error(err);
            }
            console.log(' > Start finding user with Access token. : ', user.id);
            //만약 데이터베이스에 유저가 등록되어 있으면 해당 유저 데이터를 가져온다.
            //만약 데이터베이스에 유저가 등록되어 있지 않으면 signup을 하라고 지시해줌.
            var userLoginCallback = function(err, result) {
              if (err) return console.error(err);
              else if (result.length > 0) {
                console.log('the result is..', result);
                req.session.accessToken = oauthAccessToken;
                req.session.uid = user.id
                res.data = {}
                res.data.token = oauthAccessToken
                res.redirect('/mainpage'); // **this needs to be jwtted.	
              } else {
                res.end('no user. please sign up')
              }
            }

            User.find({ id: user.id }, userLoginCallback)
          })
        }
      } ///getAccessTokenCallback

    client.getAccessToken(
      //엑세스 토큰, 즉 유저의 개인정보를 얻을 수 있는 토큰을 요청
      req.session.oauthToken,
      req.session.oauthSecret,
      getOauthVerifier(parsedUrl.search),
      getAccessTokenCallback
    );
    //signin.
    //만약 토큰이 없다면, 토큰을 다시 얻어서 redirect를 해 준다.
  },
  signup: function(req, res, next) {
    if (!req.session.oauthToken) {
      return oauth(req, res, next, 'http://localhost:3000/api/users/signin');
    }

    var parsedUrl = url.parse(req.url);
    var getAccessTokenCallback = function(error, oauthAccessToken, oauthAccessTokenSecret, results) {
      if (error) {
        console.log("ERROR:");
        console.log(error);
      } else {
        console.log('successfully get an access token.');
        var accessedClient = new Evernote.Client({
          token: oauthAccessToken,
          sandbox: true
        })

        //** session save.**//
        req.session.accessToken = oauthAccessToken;

        var userStore = accessedClient.getUserStore();
        var noteStore = accessedClient.getNoteStore();

        var filter = new Evernote.NoteFilter();
        filter.words = "updated:month-2"
        console.log('filter is..', filter);
        //노트 데이터를 가져오기 위한 메타데이터.
        var resultSpec = new Evernote.NotesMetadataResultSpec();
        resultSpec.includeTitle = true;
        resultSpec.includeContentLength = true;
        resultSpec.includeCreated = true;
        resultSpec.includeAttributes = true;
        resultSpec.includeUpdated = true;

        //노트 데이터를 가져옴.
        noteStore.findNotesMetadata(filter, 0, 100, resultSpec, function(err, notesMeta) {
          if (err) return console.error('err', err);
          console.log(" > Got " + notesMeta.notes.length + " number of notes for this user.");
          var noteGuids = [];
          for (var i in notesMeta.notes) {
            console.log(notesMeta.notes[i].title);
            noteGuids.push(notesMeta.notes[i]['guid']);
          }
          userStore.getUser(function(err, user) {
              //** got user id
              if (err) return console.log(err);
              req.session.uid = user.id;
              var makeNewUserCallback = function(err, result) {
                  if (err) return console.error(err);
                  else if (result.length > 0) {
                    console.log('already signed up.', result);
                    res.redirect('/api/notes/renew'); // **this needs to be jwtted.	
                  } else {
                    console.log('creating users..');
                    new User({
                      id: user.id,
                      listNotes: noteGuids
                    }).save(function(err, result) {
                      if (err) return console.error(err);
                      console.log('successfully saved.');
                      res.redirect('/api/notes/create')
                    })
                  }
                } //makeNewUserCallback
              User.find({ id: user.id }, makeNewUserCallback)
            }) //getUser
        });
        //get Note Data
        //get User Data.
      }
    }

    client.getAccessToken( //get AccessToken with OAuth token.
      req.session.oauthToken,
      req.session.oauthSecret,
      getOauthVerifier(parsedUrl.search),
      getAccessTokenCallback
    );
  },
  signout: function(req, res, next) {
    req.session.oauthToken = null;
    req.session.oauthSecret = null;
    req.session.accessToken = null;
    res.redirect('/');
  },
  checkAuth: function(req, res, next) {

  }
}

var getOauthVerifier = function(url) {
  var regex = new RegExp("[\\?&]oauth_verifier=([^&#]*)"),
    results = regex.exec(url);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var oauth = function(req, res, next, callbackUrl) {
  var callback = callbackUrl;
  //에버노트에서 제공해준 컨슈머 key와 secret을 가지고 Request Token을 요청함.(app 제공자의 유효성을 확인받는 것임.)
  client.getRequestToken(callback, function(err, oauthToken, oauthSecret, results) {
    if (err) {
      console.log(" > Error occurred while getting oauthToken from evernote server", err);
    } else {
      req.session.oauthToken = oauthToken;
      req.session.oauthSecret = oauthSecret;
      console.log(" > Successfully got oauth token and secret");
      var authorizeUrl = client.getAuthorizeUrl(oauthToken);
      res.redirect(authorizeUrl);
    }
  });
}
