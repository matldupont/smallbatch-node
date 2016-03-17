'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  MenuItem = mongoose.model('MenuItem'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, menuItem;

/**
 * MenuItem routes tests
 */
describe('MenuItem CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new MenuItem
    user.save(function () {
      menuItem = {
        name: 'MenuItem name'
      };

      done();
    });
  });

  it('should be able to save a MenuItem if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new MenuItem
        agent.post('/api/menuitems')
          .send(menuItem)
          .expect(200)
          .end(function (menuItemSaveErr, menuItemSaveRes) {
            // Handle MenuItem save error
            if (menuItemSaveErr) {
              return done(menuItemSaveErr);
            }

            // Get a list of MenuItems
            agent.get('/api/menuitems')
              .end(function (menuItemsGetErr, menuItemsGetRes) {
                // Handle MenuItem save error
                if (menuItemsGetErr) {
                  return done(menuItemsGetErr);
                }

                // Get MenuItems list
                var menuItems = menuItemsGetRes.body;

                // Set assertions
                (menuItems[0].user._id).should.equal(userId);
                (menuItems[0].name).should.match('MenuItem name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an MenuItem if not logged in', function (done) {
    agent.post('/api/menuitems')
      .send(menuItem)
      .expect(403)
      .end(function (menuItemSaveErr, menuItemSaveRes) {
        // Call the assertion callback
        done(menuItemSaveErr);
      });
  });

  it('should not be able to save an MenuItem if no name is provided', function (done) {
    // Invalidate name field
    menuItem.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new MenuItem
        agent.post('/api/menuitems')
          .send(menuItem)
          .expect(400)
          .end(function (menuItemSaveErr, menuItemSaveRes) {
            // Set message assertion
            (menuItemSaveRes.body.message).should.match('Please fill MenuItem name');

            // Handle MenuItem save error
            done(menuItemSaveErr);
          });
      });
  });

  it('should be able to update an MenuItem if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new MenuItem
        agent.post('/api/menuitems')
          .send(menuItem)
          .expect(200)
          .end(function (menuItemSaveErr, menuItemSaveRes) {
            // Handle MenuItem save error
            if (menuItemSaveErr) {
              return done(menuItemSaveErr);
            }

            // Update MenuItem name
            menuItem.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing MenuItem
            agent.put('/api/menuitems/' + menuItemSaveRes.body._id)
              .send(menuItem)
              .expect(200)
              .end(function (menuItemUpdateErr, menuItemUpdateRes) {
                // Handle MenuItem update error
                if (menuItemUpdateErr) {
                  return done(menuItemUpdateErr);
                }

                // Set assertions
                (menuItemUpdateRes.body._id).should.equal(menuItemSaveRes.body._id);
                (menuItemUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of MenuItems if not signed in', function (done) {
    // Create new MenuItem model instance
    var menuItemObj = new MenuItem(menuItem);

    // Save the menuItem
    menuItemObj.save(function () {
      // Request MenuItems
      request(app).get('/api/menuitems')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single MenuItem if not signed in', function (done) {
    // Create new MenuItem model instance
    var menuItemObj = new MenuItem(menuItem);

    // Save the MenuItem
    menuItemObj.save(function () {
      request(app).get('/api/menuitems/' + menuItemObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', menuItem.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single MenuItem with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/menuitems/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'MenuItem is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single MenuItem which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent MenuItem
    request(app).get('/api/menuitems/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No MenuItem with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an MenuItem if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new MenuItem
        agent.post('/api/menuitems')
          .send(menuItem)
          .expect(200)
          .end(function (menuItemSaveErr, menuItemSaveRes) {
            // Handle MenuItem save error
            if (menuItemSaveErr) {
              return done(menuItemSaveErr);
            }

            // Delete an existing MenuItem
            agent.delete('/api/menuitems/' + menuItemSaveRes.body._id)
              .send(menuItem)
              .expect(200)
              .end(function (menuItemDeleteErr, menuItemDeleteRes) {
                // Handle menuItem error error
                if (menuItemDeleteErr) {
                  return done(menuItemDeleteErr);
                }

                // Set assertions
                (menuItemDeleteRes.body._id).should.equal(menuItemSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an MenuItem if not signed in', function (done) {
    // Set MenuItem user
    menuItem.user = user;

    // Create new MenuItem model instance
    var menuItemObj = new MenuItem(menuItem);

    // Save the MenuItem
    menuItemObj.save(function () {
      // Try deleting MenuItem
      request(app).delete('/api/menuitems/' + menuItemObj._id)
        .expect(403)
        .end(function (menuItemDeleteErr, menuItemDeleteRes) {
          // Set message assertion
          (menuItemDeleteRes.body.message).should.match('User is not authorized');

          // Handle MenuItem error error
          done(menuItemDeleteErr);
        });

    });
  });

  it('should be able to get a single MenuItem that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new MenuItem
          agent.post('/api/menuitems')
            .send(menuItem)
            .expect(200)
            .end(function (menuItemSaveErr, menuItemSaveRes) {
              // Handle MenuItem save error
              if (menuItemSaveErr) {
                return done(menuItemSaveErr);
              }

              // Set assertions on new MenuItem
              (menuItemSaveRes.body.name).should.equal(menuItem.name);
              should.exist(menuItemSaveRes.body.user);
              should.equal(menuItemSaveRes.body.user._id, orphanId);

              // force the MenuItem to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the MenuItem
                    agent.get('/api/menuitems/' + menuItemSaveRes.body._id)
                      .expect(200)
                      .end(function (menuItemInfoErr, menuItemInfoRes) {
                        // Handle MenuItem error
                        if (menuItemInfoErr) {
                          return done(menuItemInfoErr);
                        }

                        // Set assertions
                        (menuItemInfoRes.body._id).should.equal(menuItemSaveRes.body._id);
                        (menuItemInfoRes.body.name).should.equal(menuItem.name);
                        should.equal(menuItemInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      MenuItem.remove().exec(done);
    });
  });
});
