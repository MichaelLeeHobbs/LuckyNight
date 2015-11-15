'use strict';
(function () {

  function MainController($scope, $http, socket, $window, $cookies, Auth, $q) {
    var self        = this;
    var cookie      = {};
    cookie.search   = 'luckyNightSearch';
    var currentUser = Auth.getCurrentUser();
    var isLoggedIn  = false;
    //var comment     = console.log.bind(console);
    var comment                = function () {};
    //var debug = console.log.bind(console);
    var debug                = function () {};
    self.searchField    = undefined;
    self.results        = [];
    self.hasResults     = false;
    self.storedSearchId = undefined;

    self.search = function (search) {
      debug('searching /api/bars/');
      if (search === '') {
        return;
      }
      $http.get('/api/bars/' + search)
        .then(function (response) {
          self.results    = response.data;
          self.hasResults = true;
          socket.syncUpdates('bar', self.results);
          setSearch(self.searchField);
        });
    };

    self.openNew = function (url) {
      $window.open(url);
    };

    self.toggleGoing = function (bussiness) {
      if (!isLoggedIn) {
        return;
      }
      var found = bussiness.visitors.some(function (ele, i, arr) {
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
          .then(function (res) {
            bussiness.visitors.push({name: currentUser.name, visitorId: currentUser._id, recId: res.data._id});
          });
      }
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('bar');
    });

    // set search on sever
    // returns record id
    function setSearchOnServer(search) {
      debug('setSearchOnServer');
      // check if we already have a stored search
      getSearchFromServer()
        .then(function (result) {
          // if no searchId create a search
          if (result === undefined) {
            $http.post('/api/searchs', {userId: currentUser._id, search: search})
              .then(function (res) {
                return res.data._id;
              });
          }
          // else update existing search
          else {
            $http.put('/api/searchs/' + result.id, {userId: currentUser._id, search: search})
              .then(function (res) {
                return res.data._id;
              });
          }
        });
    }

    // user promise for search as getting user info from db maybe slow
    function getSearchFromServer() {
      debug('getSearchFromServer');
      return $http.get('/api/searchs/me').then(
        // get store search
        function (response) {
          if (response.data.length > 0) {
            return {search: response.data[0].search, id: response.data[0]._id};
          }
        }); // end $http.get
    } // end getStoreSearchFromServer

    function getSearchFromLocal() {
      debug('getSearchFromLocal');
      return $cookies.get(cookie.search);
    }

    function setSearchOnLocal(search) {
      debug('setSearchOnLocal');
      $cookies.put(cookie.search, search);
    }

    function setSearch(search) {
      debug('setSearch');
      setSearchOnLocal(search);
      if (isLoggedIn) {
        setSearchOnServer(search);
      }
    }

    function getSearch() {
      debug('getSearch');
      // use a promise because getSearchFromServer returns one
      return $q(function (resolve, reject) {
        var search = {search: undefined, id: undefined};
        if (isLoggedIn) {
          getSearchFromServer()
            .then(function (result) {
              if (result !== undefined) {
                search.search = result.search;
                search.id     = result.id;
              }
              else {
                search.search = getSearchFromLocal();
              }
              resolve(search);
            });
        }
        else {
          search.search = getSearchFromLocal();
          resolve(search);
        }
      });
    }

    function onLoad() {
      debug('onLoad');
      getSearch().then(function (result) {
        self.searchField    = result.search;
        self.storedSearchId = result.id;
        if (self.searchField !== undefined) {
          comment('searching for ' + self.searchField);
          self.search(self.searchField);
        }
      });
    } // end onLoad

    // make sure this promise has resolved before we do onLoad
    Auth.isLoggedIn(function (bool) {
      isLoggedIn = bool;
      onLoad();
    });
  }

  angular.module('luckyNightApp')
    .controller('MainController', MainController);

})();
