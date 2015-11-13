'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var searchCtrlStub = {
  index: 'searchCtrl.index',
  show: 'searchCtrl.show',
  create: 'searchCtrl.create',
  update: 'searchCtrl.update',
  destroy: 'searchCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var searchIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './search.controller': searchCtrlStub
});

describe('Search API Router:', function() {

  it('should return an express router instance', function() {
    searchIndex.should.equal(routerStub);
  });

  describe('GET /api/searchs', function() {

    it('should route to search.controller.index', function() {
      routerStub.get
        .withArgs('/', 'searchCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/searchs/:id', function() {

    it('should route to search.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'searchCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/searchs', function() {

    it('should route to search.controller.create', function() {
      routerStub.post
        .withArgs('/', 'searchCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/searchs/:id', function() {

    it('should route to search.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'searchCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/searchs/:id', function() {

    it('should route to search.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'searchCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/searchs/:id', function() {

    it('should route to search.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'searchCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
