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
			console.log('the user is..!',result);
			var noteStore = accessedClient.getNoteStore();
			var asyncGetNote = []
			var guids = result.listNotes;
			console.log(guids);
			for(var i =0; i<guids.length; i++){
				asyncGetNote.push(
					noteStore.getNote(guids[i], true, true, true, true, function(err, result){
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
							resources: JSON.stringify(result.resources),
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
		console.log(req.body);
		console.log(req.session.uid);
		Note.findOne({
			user_id: req.session.uid,
			guid : req.body.guid
		}, function(err, result){
			if(err) console.error(err);
			console.log(result);
			console.log(result.phase);
			var nextPhase = parseInt(result.phase);
			console.log(nextPhase);
			nextPhase++;
			console.log('nextPhase is',nextPhase);
			Note.update({
				user_id: req.session.uid,
				guid : req.body.guid

			},{
				phase: nextPhase.toString()
			},{},function(err, result){
				if(err) console.error(err)
					res.end(JSON.stringify(result))
			})
		})
	},
	renewPhase : function(req, res, next){
		console.log('renewphase', req.session);
		res.redirect('/mainpage');

	},
	openOneNote : function(req, res, next){

	},
	getNote: function(req, res, next){
		console.log('getting note.')
		console.log(req.session);
		Note.find({
			user_id : req.session.uid
		}, function(err, result){
			res.json(result);
		})

	}
};