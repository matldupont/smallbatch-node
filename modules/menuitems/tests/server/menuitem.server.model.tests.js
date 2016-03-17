'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  MenuItem = mongoose.model('MenuItem');

/**
 * Globals
 */
var user, menuItem;

/**
 * Unit tests
 */
describe('MenuItem Model Unit Tests:', function() {
  beforeEach(function(done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    user.save(function() { 
      menuItem = new MenuItem({
        name: 'MenuItem Name',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(0);
      return menuItem.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function(done) { 
      menuItem.name = '';

      return menuItem.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) { 
    MenuItem.remove().exec(function(){
      User.remove().exec(function(){
        done();  
      });
    });
  });
});
