'use strict';
(function () {

  function MainController($scope, $http, socket, $window, $cookies, Auth, $q) {
    var self                   = this;
    var cookieLuckyNightSearch = 'luckyNightSearch';
    self.searchField           = undefined;
    self.results               = [];
    self.hasResults            = false;
    self.storedSearchId        = undefined;

    self.search = function () {
      $http.get('/api/bars/' + self.searchField).then(function (response) {
        self.results    = response.data;
        self.hasResults = true;
        socket.syncUpdates('bar', self.results);

        if (Auth.isLoggedIn()) {

          if (self.storedSearchId === undefined) {
            $http.post('/api/searchs', {userId: Auth.getCurrentUser()._id, search: self.searchField});
          }
          else {
            $http.put('/api/searchs' + self.storedSearchId, {userId: Auth.getCurrentUser()._id, search: self.searchField});
          }
        }


      });
      $cookies.put(cookieLuckyNightSearch, self.searchField);
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
    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('bar');
    });

    // onLoad logic here

    // user promise for search as getting user info from db maybe slow
    function getSearch() {
      return $q(function (resolve, reject) {
        // check if user has stored search
        if (Auth.isLoggedIn()) {
          // todo get storedSearch from user profile
          $http.get('/api/searchs/' + Auth.getCurrentUser()._id).then(
            // get store search
            function (response) {
              console.log(response);
              self.searchField = response.search;
              self.storedSearchId = response._id;
            },
            // fall back to cookie
            function (res) {
              resolve($cookies.get(cookieLuckyNightSearch));
            });
        }
        // else check if they have stored search in cookie
        else {
          resolve($cookies.get(cookieLuckyNightSearch));
        }
      });
    }

    getSearch().then(function (result) {
      if (result !== undefined) {
        self.searchField = result;
        self.search();
      }
    });


  }

  angular.module('luckyNightApp')
    .controller('MainController', MainController);

})();
