var Evernote = require('evernote').Evernote;

var CONSUMER_KEY = 'ohs2033-9362';
var CONSUMER_SECRET = '7d74f6d142fb6978';

if(CONSUMER_KEY === "Put your consumer key here"){
  console.error("\nPlease enter your Evernote consumer key and secret\n\nIf you don't have a key you can get one at:\nhttps://dev.evernote.com/#apikey\n");
  process.exit(1);
}

var gb = {};
gb.oauthToken = '';
gb.oauthSecret = '';


var client = new Evernote.Client ({
  consumerKey: 'ohs2033-9362',
  consumerSecret: '7d74f6d142fb6978',
  sandbox: true
});


exports.client = client;
exports.gb = gb;


