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


router.get('/',function (request,response){
	var parsedUrl = url.parse(request.url);
	console.log('search is:'+parsedUrl.search)
	client.getAccessToken(
	  gb.oauthToken, 
	  gb.oauthSecret, 
	  getOauthVerifier(parsedUrl.search), 
	  function(error, oauthAccessToken, oauthAccessTokenSecret, results) {
	    if(error) {
	      console.log("error\n\n\n");
	      console.log(error);
	    }
	    else {
	      console.log('successfully get an access token.');
	      var accessedClient = new Evernote.Client({
	      	token: oauthAccessToken,
	      	sandbox:true
	      })
	      var userStore = accessedClient.getUserStore();
	      userStore.getUser( function (err, user){
	      	console.log(err);

	      	response.end(JSON.stringify(user));
	      })

		    //  var noteStore = accessedClient.getNoteStore("https://sandbox.evernote.com/edam/note/");
		    //  noteStore.listNotebooks(function(err, notebook){
	      		 
	     //  	      var filter = new Evernote.NoteFilter();
	      	      
	     //  	      // filter.notebookGuid = notebook[0].guid;

	     //  	      console.log('filter is..',filter);
	     //  	      var resultSpec = new Evernote.NotesMetadataResultSpec();
	     //  	      resultSpec.includeTitle = true;
	     //  	      resultSpec.includeContentLength = true;
	     //  	      resultSpec.includeCreated = true;
	     //  	      resultSpec.includeAttributes = true;

	     //  	      console.log('result Spec is ',resultSpec);

	     //  	      noteStore.findNotesMetadata(filter, 0, 100, resultSpec, function(err, notesMeta) {
	     //  		      if (err) {
	     //  		        console.error('err',err);
	     //  		      }
	     //  		      else {

	     //  		        console.log("Found "+notesMeta.notes.length+" notes in your default notebook . . .")
	     //  		        for (var i in notesMeta.notes) {
	     //  		         var noteGuid = notesMeta.notes[i].guid
	     //  		         console.log('note guid is:',noteGuid);
	     //  		         var note = noteStore.getNote(
	     //  		         	noteGuid,
	     //  		         	true, 
	     //  		         	true, 
	     //  		         	true, 
	     //  		         	true,
		    //   		         function(err, results){
		    //   		         	console.log('working..');
		    //   		         	if(err) console.error("ERROR IS :",err);
		    //   		         	var htmled = enml.HTMLOfENML(results.content, results.resources);
		    //   		         	response.end(htmled);
		    //   		         })    		          
	     //  		        }
	     //  	          }
	     //  	      }); 
		    //   })
		    }   
	  }
	);
})
    

module.exports = router;