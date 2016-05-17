var Note = require('../model/noteModel');
var Evernote = require('evernote').Evernote;
var User = require('../model/userModel');
var Note = require('../model/noteModel');
var Promise = require('bluebird');
module.exports = {

	noteStoring : function(req, res, next){
		console.log('noteStoring..');
		var accessedClient = new Evernote.Client({
	      	token: req.session.accessToken,
	      	sandbox: true
	    });
		User.findOne({ id: req.session.uid }, function (err, result) {
			console.log(result);
			var noteStore = accessedClient.getNoteStore();
			var asyncGetNote = []
			var guids = result['listNotes']
			console.log(guids);
			for(var i =0; i<guids.length; i++){
				asyncGetNote.push(
					noteStore.getNote(guids[0], true, true, true, true, function(err, result){
						if(err) console.error(err)
						// console.log(result);
						//create notes.
						new Note({
							guid: result.guid,
							user_id: req.session.uid,
							update_date: result.updated,
							create_date: result.created,
							title: result.title,
							content: result.content,
							resource: result.resources,
							phase: '0',
							activate: true
						}).save(function(err,result){
							if(err) console.error(err);
							console.log('note saved..');
							console.log(result);
						})


					})
				)
			}
			console.log('async all pushed.');
			console.log('async: ',asyncGetNote);
			
			Promise.all(asyncGetNote).then(function () {
				console.log('end! Promiseal!!!');
				res.redirect('/mainpage');
			})
			
		})

	    



	},
	notePhaseUp : function(req, res, next){
		//if
	},
	renewPhase : function(req, res, next){
		console.log('renewphase', req.session);
		res.redirect('/mainpage');

	},
	openOneNote : function(req, res, next){

	}
};