'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Meal = mongoose.model('Meal'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, meal;

/**
 * Meal routes tests
 */
describe('Meal CRUD tests', function () {

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

    // Save a user to the test db and create new Meal
    user.save(function () {
      meal = {
        name: 'Meal name'
      };

      done();
    });
  });

  it('should be able to save a Meal if logged in', function (done) {
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

        // Save a new Meal
        agent.post('/api/meals')
          .send(meal)
          .expect(200)
          .end(function (mealSaveErr, mealSaveRes) {
            // Handle Meal save error
            if (mealSaveErr) {
              return done(mealSaveErr);
            }

            // Get a list of Meals
            agent.get('/api/meals')
              .end(function (mealsGetErr, mealsGetRes) {
                // Handle Meal save error
                if (mealsGetErr) {
                  return done(mealsGetErr);
                }

                // Get Meals list
                var meals = mealsGetRes.body;

                // Set assertions
                (meals[0].user._id).should.equal(userId);
                (meals[0].name).should.match('Meal name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Meal if not logged in', function (done) {
    agent.post('/api/meals')
      .send(meal)
      .expect(403)
      .end(function (mealSaveErr, mealSaveRes) {
        // Call the assertion callback
        done(mealSaveErr);
      });
  });

  it('should not be able to save an Meal if no name is provided', function (done) {
    // Invalidate name field
    meal.name = '';

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

        // Save a new Meal
        agent.post('/api/meals')
          .send(meal)
          .expect(400)
          .end(function (mealSaveErr, mealSaveRes) {
            // Set message assertion
            (mealSaveRes.body.message).should.match('Please fill Meal name');

            // Handle Meal save error
            done(mealSaveErr);
          });
      });
  });

  it('should be able to update an Meal if signed in', function (done) {
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

        // Save a new Meal
        agent.post('/api/meals')
          .send(meal)
          .expect(200)
          .end(function (mealSaveErr, mealSaveRes) {
            // Handle Meal save error
            if (mealSaveErr) {
              return done(mealSaveErr);
            }

            // Update Meal name
            meal.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Meal
            agent.put('/api/meals/' + mealSaveRes.body._id)
              .send(meal)
              .expect(200)
              .end(function (mealUpdateErr, mealUpdateRes) {
                // Handle Meal update error
                if (mealUpdateErr) {
                  return done(mealUpdateErr);
                }

                // Set assertions
                (mealUpdateRes.body._id).should.equal(mealSaveRes.body._id);
                (mealUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Meals if not signed in', function (done) {
    // Create new Meal model instance
    var mealObj = new Meal(meal);

    // Save the meal
    mealObj.save(function () {
      // Request Meals
      request(app).get('/api/meals')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Meal if not signed in', function (done) {
    // Create new Meal model instance
    var mealObj = new Meal(meal);

    // Save the Meal
    mealObj.save(function () {
      request(app).get('/api/meals/' + mealObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', meal.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Meal with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/meals/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Meal is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Meal which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Meal
    request(app).get('/api/meals/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Meal with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Meal if signed in', function (done) {
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

        // Save a new Meal
        agent.post('/api/meals')
          .send(meal)
          .expect(200)
          .end(function (mealSaveErr, mealSaveRes) {
            // Handle Meal save error
            if (mealSaveErr) {
              return done(mealSaveErr);
            }

            // Delete an existing Meal
            agent.delete('/api/meals/' + mealSaveRes.body._id)
              .send(meal)
              .expect(200)
              .end(function (mealDeleteErr, mealDeleteRes) {
                // Handle meal error error
                if (mealDeleteErr) {
                  return done(mealDeleteErr);
                }

                // Set assertions
                (mealDeleteRes.body._id).should.equal(mealSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Meal if not signed in', function (done) {
    // Set Meal user
    meal.user = user;

    // Create new Meal model instance
    var mealObj = new Meal(meal);

    // Save the Meal
    mealObj.save(function () {
      // Try deleting Meal
      request(app).delete('/api/meals/' + mealObj._id)
        .expect(403)
        .end(function (mealDeleteErr, mealDeleteRes) {
          // Set message assertion
          (mealDeleteRes.body.message).should.match('User is not authorized');

          // Handle Meal error error
          done(mealDeleteErr);
        });

    });
  });

  it('should be able to get a single Meal that has an orphaned user reference', function (done) {
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

          // Save a new Meal
          agent.post('/api/meals')
            .send(meal)
            .expect(200)
            .end(function (mealSaveErr, mealSaveRes) {
              // Handle Meal save error
              if (mealSaveErr) {
                return done(mealSaveErr);
              }

              // Set assertions on new Meal
              (mealSaveRes.body.name).should.equal(meal.name);
              should.exist(mealSaveRes.body.user);
              should.equal(mealSaveRes.body.user._id, orphanId);

              // force the Meal to have an orphaned user reference
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

                    // Get the Meal
                    agent.get('/api/meals/' + mealSaveRes.body._id)
                      .expect(200)
                      .end(function (mealInfoErr, mealInfoRes) {
                        // Handle Meal error
                        if (mealInfoErr) {
                          return done(mealInfoErr);
                        }

                        // Set assertions
                        (mealInfoRes.body._id).should.equal(mealSaveRes.body._id);
                        (mealInfoRes.body.name).should.equal(meal.name);
                        should.equal(mealInfoRes.body.user, undefined);

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
      Meal.remove().exec(done);
    });
  });
});
