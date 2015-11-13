'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var Schema = mongoose.Schema;

var SearchSchema = new Schema({
  userId: String,
  search: String,
  active: Boolean
});

module.exports = mongoose.model('Search', SearchSchema);
