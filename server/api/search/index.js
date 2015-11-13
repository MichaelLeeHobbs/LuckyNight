'use strict';

var express = require('express');
var controller = require('./search.controller');
//var auth = require('../../auth/auth.service');
import auth from '../../auth/auth.service';

var router = express.Router();

// all routes are restricted to owner or admin
router.get('/', auth.hasRole('admin'), controller.index);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.get('/user/:id', auth.isAuthenticated(), controller.userShow);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.patch('/:id', auth.isAuthenticated(), controller.update);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);

module.exports = router;
