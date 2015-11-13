'use strict';
(function () {

  function MainController($scope, $http, socket, $window, $cookies, Auth, $q) {
    var self                   = this;
    var cookieLuckyNightSearch = 'luckyNightSearch';
    var currentUser            = Auth.getCurrentUser();
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
            $http.post('/api/searchs', {userId: currentUser._id, search: self.searchField});
          }
          else {
            $http.put('/api/searchs' + self.storedSearchId, {userId: currentUser._id, search: self.searchField});
          }
        }


      });
      $cookies.put(cookieLuckyNightSearch, self.searchField);
    };

    self.openNew = function (url) {
      $window.open(url);
    };

    self.toggleGoing = function (bussiness) {
      var found;
      var recId;
      bussiness.visitors.forEach(function (ele) {
        console.log(ele.visitorId);
        console.log(currentUser._id);
        if (ele.visitorId === currentUser._id) {
          found = true;
          recId = ele.recId;
        }
      });

      if (found) {
        $http.delete('/api/bars/' + recId);
      } else {
        var today = new Date();
        $http.post('/api/bars/',  {
            yelpId: bussiness.id,
            name: bussiness.name,
            date: (today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear()),
            visitor: currentUser.name,
            visitorId: currentUser._id
          });
      }
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
          console.log('logged in getting search');
          // todo get storedSearch from user profile
          $http.get('/api/searchs/user/' + currentUser._id).then(
            // get store search
            function (response) {
              console.log(response);
              resolve({search: response.data[0].search,  id: response.data[0]._id});
            },
            // fall back to cookie
            function (res) {
              console.log('fallback');
              resolve($cookies.get(cookieLuckyNightSearch));
            });
        }
        // else check if they have stored search in cookie
        else {
          resolve({search: $cookies.get(cookieLuckyNightSearch),  id: undefined});
        }
      });
    }

    getSearch().then(function (result) {
      if (result !== undefined) {
        self.searchField = result.search;
        self.storedSearchId = result.id;
        self.search();
      }
    });


  }

  angular.module('luckyNightApp')
    .controller('MainController', MainController);

})();
