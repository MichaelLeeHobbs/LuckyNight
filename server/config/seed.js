/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import Thing from '../api/thing/thing.model';
import User from '../api/user/user.model';
import Bar from '../api/bar/bar.model';

Thing.find({}).removeAsync()
  .then(function () {
    Thing.create({
      name: 'Development Tools',
      info: 'Integration with popular tools such as Bower, Grunt, Babel, Karma, ' +
            'Mocha, JSHint, Node Inspector, Livereload, Protractor, Jade, ' +
            'Stylus, Sass, and Less.'
    }, {
      name: 'Server and Client integration',
      info: 'Built with a powerful and fun stack: MongoDB, Express, ' +
            'AngularJS, and Node.'
    }, {
      name: 'Smart Build System',
      info: 'Build system ignores `spec` files, allowing you to keep ' +
            'tests alongside code. Automatic injection of scripts and ' +
            'styles into your index.html'
    }, {
      name: 'Modular Structure',
      info: 'Best practice client and server structures allow for more ' +
            'code reusability and maximum scalability'
    }, {
      name: 'Optimized Build',
      info: 'Build process packs up your templates as a single JavaScript ' +
            'payload, minifies your scripts/css/images, and rewrites asset ' +
            'names for caching.'
    }, {
      name: 'Deployment Ready',
      info: 'Easily deploy your app to Heroku or Openshift with the heroku ' +
            'and openshift subgenerators'
    });
  });

User.find({}).removeAsync()
  .then(function () {
    User.createAsync({
      provider: 'local',
      name:     'Test User',
      email:    'test@example.com',
      password: 'test'
    }, {
      provider: 'local',
      role:     'admin',
      name:     'Admin',
      email:    'admin@example.com',
      password: 'admin'
    })
      .then(function () {
        console.log('finished populating users');

        User.find({email: 'admin@example.com'})
          .then(function (usr) {
            createBars(usr[0]);
          });
      });
  });

/*
 name: String,
 date: String,
 visitor: String,
 visitorId: String,
 */
var createBars = function (usr) {
  Bar.find({}).removeAsync()
    .then(function () {
      var today       = new Date();
      var todayDate   = (today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear())
      var anotherDate = (today.getDate() + '-' + (today.getMonth() + 1) + '-' + 1986);
      Bar.create({
        name: 'Oasis',
        date: todayDate,
        visitor: usr.name,
        visitorId: usr._id
      },{
        name: 'Oasis',
        date: todayDate,
        visitor: 'FakeUser',
        visitorId: -999
      },{
        name: 'Oasis',
        date: anotherDate,
        visitor: usr.name,
        visitorId: usr._id
      });
    });
};
