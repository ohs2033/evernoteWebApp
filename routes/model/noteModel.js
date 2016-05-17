var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var NoteSchema = new mongoose.Schema({
	guid: String,
	user_id: String,
	update_date: String,
	create_date: String,
	title: String,
	content: String,
	resources: String,
	//repeated phase data.
	phase: String,
	startDate: String,
	endDate: String,
	activate: Boolean
});

module.exports = mongoose.model('Note', NoteSchema);