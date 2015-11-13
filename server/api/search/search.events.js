/**
 * Search model events
 */

'use strict';

var EventEmitter = require('events').EventEmitter;
var Search = require('./search.model');
var SearchEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
SearchEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Search.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    SearchEvents.emit(event + ':' + doc._id, doc);
    SearchEvents.emit(event, doc);
  }
}

module.exports = SearchEvents;
