// Template for shortURL document datastructure
var mongoose = require('mongoose');
var schema = mongoose.Schema;

var urlSchema = new schema({
  originalURL: String,
  shortID: Number,
  shorterURL: String
}, {timestamps: true});

var model = mongoose.model('shortURL', urlSchema);

module.exports = model;