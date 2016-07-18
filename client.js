//에버노트 API에 접근하는 클라이언트를 생성하는 부분. 에버노트가 제공해준 컨슈머 키와 컨슈머 시크릿이 필요함.

var Evernote = require('evernote').Evernote;
var secret = require('./.secret')

var CONSUMER_KEY = secret.CONSUMER_KEY;
var CONSUMER_SECRET = secret.CONSUMER_SECRET;

if (CONSUMER_KEY === "Put your consumer key here") {
  console.error("\nPlease enter your Evernote consumer key and secret\n\nIf you don't have a key you can get one at:\nhttps://dev.evernote.com/#apikey\n");
  process.exit(1);
}

var gb = {};
gb.oauthToken = '';
gb.oauthSecret = '';

//클라이언트를 생성. 샌드박스용 클라이언트이다.
var client = new Evernote.Client({
  consumerKey: CONSUMER_KEY,
  consumerSecret: CONSUMER_SECRET,
  sandbox: true
});


exports.client = client;
exports.gb = gb;
