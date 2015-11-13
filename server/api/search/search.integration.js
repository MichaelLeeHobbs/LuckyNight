'use strict';

var app = require('../..');
var request = require('supertest');

var newSearch;

describe('Search API:', function() {

  describe('GET /api/searchs', function() {
    var searchs;

    beforeEach(function(done) {
      request(app)
        .get('/api/searchs')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          searchs = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      searchs.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/searchs', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/searchs')
        .send({
          name: 'New Search',
          info: 'This is the brand new search!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          newSearch = res.body;
          done();
        });
    });

    it('should respond with the newly created search', function() {
      newSearch.name.should.equal('New Search');
      newSearch.info.should.equal('This is the brand new search!!!');
    });

  });

  describe('GET /api/searchs/:id', function() {
    var search;

    beforeEach(function(done) {
      request(app)
        .get('/api/searchs/' + newSearch._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          search = res.body;
          done();
        });
    });

    afterEach(function() {
      search = {};
    });

    it('should respond with the requested search', function() {
      search.name.should.equal('New Search');
      search.info.should.equal('This is the brand new search!!!');
    });

  });

  describe('PUT /api/searchs/:id', function() {
    var updatedSearch

    beforeEach(function(done) {
      request(app)
        .put('/api/searchs/' + newSearch._id)
        .send({
          name: 'Updated Search',
          info: 'This is the updated search!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedSearch = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedSearch = {};
    });

    it('should respond with the updated search', function() {
      updatedSearch.name.should.equal('Updated Search');
      updatedSearch.info.should.equal('This is the updated search!!!');
    });

  });

  describe('DELETE /api/searchs/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/searchs/' + newSearch._id)
        .expect(204)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when search does not exist', function(done) {
      request(app)
        .delete('/api/searchs/' + newSearch._id)
        .expect(404)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });

  });

});
