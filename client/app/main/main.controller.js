'use strict';
(function() {

function MainController($scope, $http, socket, $window) {
  var self = this;
  self.results = [];
  self.hasResults = false;

  self.search = function () {
    $http.get('/api/bars/' + self.searchField).then(function(response) {
      self.results = response.data;
      self.hasResults = true;
      socket.syncUpdates('bar', self.results);
    });
  };

  self.openNew = function (url) {
    $window.open(url);
  };
/*
  this.addThing = function() {
    if (self.newThing === '') {
      return;
    }
    $http.post('/api/things', { name: self.newThing });
    self.newThing = '';
  };

  this.deleteThing = function(thing) {
    $http.delete('/api/bars/' + thing._id);
  };
*/
  $scope.$on('$destroy', function() {
    socket.unsyncUpdates('bar');
  });
}

angular.module('luckyNightApp')
  .controller('MainController', MainController);

})();
