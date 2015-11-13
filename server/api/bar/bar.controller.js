/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/bars              ->  index
 * GET     /api/bars/:location    ->  index by location
 * POST    /api/bars              ->  create
 * GET     /api/bars/:id          ->  show
 * PUT     /api/bars/:id          ->  update
 * DELETE  /api/bars/:id          ->  destroy
 */

'use strict';

import config from '../../config/yelp';
var yelp = require("../../config/yelp");

var _   = require('lodash');
var Bar = require('./bar.model');

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function (err) {
    res.status(statusCode).send(err);
  };
}

function responseWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function (entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function handleEntityNotFound(res) {
  return function (entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function saveUpdates(updates) {
  return function (entity) {
    var updated = _.merge(entity, updates);
    return updated.saveAsync()
      .spread(function (updated) {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function (entity) {
    if (entity) {
      return entity.removeAsync()
        .then(function () {
          res.status(204).end();
        });
    }
  };
}

// Gets a list of Bars
exports.index = function (req, res) {
  Bar.findAsync()
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Gets a list of Bars by location
exports.indexByLocation = function (req, res) {
  var today   = new Date();
  var reqDate = (req.body.date !== undefined) ? String(req.body.date) : (today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear());

  // Setup Yelp
  var yelpApi = require("yelp").createClient({
    consumer_key:    yelp.CONSUMER_KEY,
    consumer_secret: yelp.CONSUMER_SECRET,
    token:           yelp.TOKEN,
    token_secret:    yelp.TOKEN_SECRET
  });

  yelpApi.search({category_filter: "nightlife", location: req.params.location}, function (error, searchResult) {
    var async = require("async");
    async.each(searchResult.businesses, function (searchResultElement, callback) {
        searchResultElement.visitors = [];
        Bar.findAsync({yelpId: searchResultElement.id, date: reqDate})
          .then(function (findResult) {
            findResult.forEach(function (ele) {
              searchResultElement.visitors.push({name: ele.visitor, visitorId: ele.visitorId, recId: ele._id});
            });
          })
          // log errors
          .catch(function (res) {
            console.log(res);
          })
          .then(callback);
      },
      function (err) {
        console.log('err: ' + err);
        res.json(searchResult.businesses);
        console.log('sent response');
        //console.log(searchResult.businesses);
      }
    );
  });
};

// Gets a single Bar from the DB
exports.show = function (req, res) {
  Bar.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Creates a new Bar in the DB
exports.create = function (req, res) {
  Bar.findAsync({yelpId: req.body.yelpId, date: req.body.date, visitorId: req.body.visitorId})
    .then(function (result) {
      // if record already exist do not create new record
      if (result.length > 0) {
        responseWithResult(res, 304)(result);
      }
      // else create record
      else {
        Bar.createAsync(req.body)
          .then(responseWithResult(res, 201))
          .catch(handleError(res));
      }
    })
    .catch(handleError(res));
};

// Updates an existing Bar in the DB
exports.update = function (req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Bar.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Deletes a Bar from the DB
exports.destroy = function (req, res) {
  Bar.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
};
