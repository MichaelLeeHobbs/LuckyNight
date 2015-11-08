'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var Schema = mongoose.Schema;

var BarSchema = new Schema({
  name: String,
  date: String,
  visitor: String,
  visitorId: String,
  active: Boolean
});

module.exports = mongoose.model('Bar', BarSchema);
