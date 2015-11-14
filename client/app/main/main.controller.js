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
            $http.post('/api/searchs', {userId: currentUser._id, search: self.searchField})
              .then(function (res) {
                self.storedSearchId = res.data._id;
              });
          }
          else {
            console.log('storeSearchId: ' + self.storedSearchId);
            $http.put('/api/searchs/' + self.storedSearchId, {userId: currentUser._id, search: self.searchField});
          }
        }
      });
      $cookies.put(cookieLuckyNightSearch, self.searchField);
    };

    self.openNew = function (url) {
      $window.open(url);
    };

    self.toggleGoing = function (bussiness) {
      var found = bussiness.visitors.some(function (ele, i, arr) {
        console.log(ele.visitorId);
        console.log(currentUser._id);
        if (ele.visitorId === currentUser._id) {
          $http.delete('/api/bars/' + ele.recId);
          arr.splice(i, 1);
        }
      });

      if (!found) {
        var today = new Date();
        $http.post('/api/bars/', {
          yelpId:    bussiness.id,
          name:      bussiness.name,
          date:      (today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear()),
          visitor:   currentUser.name,
          visitorId: currentUser._id
        })
        .then(function(res){
            bussiness.visitors.push({name: currentUser.name, visitorId: currentUser._id, recId: res.data._id});
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

          // todo remove debug
          $http.get('/api/searchs').then(function(res) {
            console.log('search db dump');
            console.log(res);
          });

          $http.get('/api/searchs/me').then(
            // get store search
            function (response) {
              console.log(response);
              if (response.data.length > 0) {
                console.log('using server search');
                resolve({search: response.data[0].search, id: response.data[0]._id});
              } else {
                console.log('using cookie search');
                resolve($cookies.get(cookieLuckyNightSearch));
              }

            },
            // fall back to cookie
            function () {
              console.log('fallback');
              console.log('using cookie search');
              resolve({search: $cookies.get(cookieLuckyNightSearch), id: undefined});
            });
        }
        // else check if they have stored search in cookie
        else {
          resolve({search: $cookies.get(cookieLuckyNightSearch), id: undefined});
        }
      });
    }

    getSearch().then(function (result) {
      if (result !== undefined) {
        self.searchField    = result.search;
        self.storedSearchId = result.id;
        self.search();
      }
    });


  }

  angular.module('luckyNightApp')
    .controller('MainController', MainController);

})();
