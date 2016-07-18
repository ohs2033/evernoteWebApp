var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
  id: String,
  lastLogin: String,
  listNotes: []
});

module.exports = mongoose.model('User', UserSchema);
