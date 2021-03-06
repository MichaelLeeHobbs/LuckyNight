/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/searchs              ->  index
 * POST    /api/searchs              ->  create
 * GET     /api/searchs/:id          ->  show
 * PUT     /api/searchs/:id          ->  update
 * DELETE  /api/searchs/:id          ->  destroy
 */

'use strict';

var _      = require('lodash');
var Search = require('./search.model');
var auth   = require('../../auth/auth.service');

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

function isOwnerOfReq(req) {
  // !== does not work for some reason
  var reqId = (req.params.id === undefined) ? req.body.userId : req.params.id;
  if (req.user._id == reqId) {
    return true;
  }
}

// admin only
exports.index = function (req, res) {
  Search.findAsync()
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Gets a single Search by req.user._id from the DB
exports.showMe = function (req, res) {
  Search.findAsync({userId: req.user._id})
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Gets a single Search
exports.show = function (req, res) {
  Search.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(function (result) {
      if (result.userId === req.user._id) {
        responseWithResult(res)(result);
      } else {
        // reject if not the owner of record
        return res.status(403).end();
      }
    })
    .catch(handleError(res));
};

// Creates a new Search in the DB
exports.create = function (req, res) {
  console.log('search create req.body');
  console.log(req.body);
  // reject if not the owner of the search or adim
  if (!isOwnerOfReq(req)) {
    return res.status(403).end();
  }
  if (req.body.search === undefined || req.body.userId === undefined){
    return res.status(400).end();
  }
  Search.findAsync({userId: req.user._id})
    .then(function(result){
      if (result.length > 0) {
        return res.status(409).end();
      } else {
        Search.createAsync(req.body)
          .then(responseWithResult(res, 201))
          .catch(handleError(res));
      }
    });
};

// Updates an existing Search in the DB
exports.update = function (req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Search.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(function (result) {
      if (result.userId === req.user._id) {
        saveUpdates(req.body)(res);
      } else {
        // reject if not the owner of record
        return res.status(403).end();
      }
    })
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Deletes a Search from the DB
exports.destroy = function (req, res) {
  Search.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(function (result) {
      if (result.userId === req.user._id) {
        removeEntity(res)(result);
      } else {
        // reject if not the owner of record
        return res.status(403).end();
      }
    })
    .catch(handleError(res));
};
