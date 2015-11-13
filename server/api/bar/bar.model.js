'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var Schema = mongoose.Schema;

var BarSchema = new Schema({
  yelpId: String,
  name: String,
  date: String,
  visitor: String,
  visitorId: String,
  active: Boolean
});

var validatePresenceOf = function(value) {
  return value && value.length;
};


var validateNotEmpty = function(name) {
  BarSchema
    .path(name)
    .validate(function(name){
      return validatePresenceOf(name);
    }, name + ' cannot be empty.');
};

validateNotEmpty('yelpId');
validateNotEmpty('name');
validateNotEmpty('date');
validateNotEmpty('visitor');
validateNotEmpty('visitorId');

module.exports = mongoose.model('Bar', BarSchema);
