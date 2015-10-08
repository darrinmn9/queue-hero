var Transaction = require('../transactions/transactionModel.js');
var Checkin = require('../checkins/checkinModel.js');
var Yelp = require("yelp");
var Q = require('q');
var User = require('./../users/userModel.js');

var Auth;

// load apikeys if localhost. process.env.DEPLOYED set in heroku
if (!process.env.DEPLOYED) {
  Auth = require('../config/api_keys.js');
}

module.exports = {

  /*
   * @param {Object} on req.query {lat: lat, long: long}
   * @return {Array} Array with map and location options
   */
  getLocationOptions: function(req, res, next) {
    var lat = req.query.lat;
    var long = req.query.long;
    var location = lat + ',' + long;

    // store venue info from yelp
    var venues = [];

    // use environment variable in heroku if deployed, api_keys.js if local
    var yelp = Yelp.createClient({
      consumer_key: process.env.YELP_CONSUMER_KEY || Auth.yelp.consumer_key,
      consumer_secret: process.env.YELP_CONSUMER_SECRET || Auth.yelp.consumer_secret,
      token: process.env.YELP_TOKEN || Auth.yelp.token,
      token_secret: process.env.YELP_TOKEN_SECRET || Auth.yelp.token_secret
    });

    /*
     * Yelp search parameters
     *
     * search method: ll = search by lat,long | location = search by address
     * sort: 0 = Best Matched, 1 = Distance, 2 = Highest Rated
     * category_filter: see http://bit.ly/1Lp7Mhr
     * radius_filter: search radius in meters
     * limit: number of results
     */
    yelp.search({
      ll: location,
      sort: 1,
      category_filter: 'food',
      radius_filter: 300,
      limit: 10
    }, function(error, data) {
      var venuesFromYelp = data.businesses;
      venuesFromYelp.forEach(function(value) {
        venues.push({
          yelpId: value.id,
          name: value.name,
          //address: value.location.address,
          //city: value.location.city,
          //state: value.location.state_code,
          //zip: value.location.postal_code,

          // displayAddress in []. May include building name + full address
          displayAddress: value.location.display_address.join(' '),

          lat: value.location.coordinate.latitude,
          long: value.location.coordinate.longitude,

          // ########## format
          //phone: value.phone,

          // +1-###-###-#### format
          //displayPhone: value.display_phone,

          // distance from hero in meters
          //distance: value.distance,

          //categories: value.categories,
          //image_url: value.image_url
        });
      });
      res.status(200).send(venues);
    });
  },

  /*
   * @param {Object} queuehero: queuehero, location: location
   * @return {String} checkin._id
   */
  setLocation: function(req, res, next) {
    var location = req.body.location;
    var queueHero = req.body.queueHero;

    var newCheckin = new Checkin({
      queueHero: queueHero,
      vendor: location.name,
      meetingLocation: [location.lat, location.long],
      vendorYelpId: location.yelpId,
      meetingAddress: location.meetingAddress

    });

    newCheckin.save(function(err) {
      if (err) {
        consoole.log(err);
        res.status(500).send();
      } else {
        // returning newCheckin._id, may use it in /hero/task
        res.status(201).send(newCheckin._id);
      }
    });
  },

  checkOrderComplete: function(req, res, next) {
    //get transaction id from request
    var transactionId = req.query.transactionId;

    // find transaction, and then check if status is complete
    var findTransaction = Q.nbind(Transaction.findOne, Transaction);
    findTransaction({
      _id: transactionId
    })
      .then(function(transaction) {
        if (!transaction) {
          console.log('transaction does not exist');
          res.status(400).send();
        } else {
          if (transaction.status === 'complete') {
            res.status(200).send(true);
          } else {
            res.status(200).send(false);
          }
        }
      })
      .fail(function(error) {
        res.status(401).send();
      });

  },

  acceptRequest: function(req, res, next) {
    //get transaction id from request
    var transactionId = req.body.transactionId;
    var queueHero = req.body.queueHero;
    var update = {
      queueHero: queueHero,
      status: 'inprogress'
    };

    Transaction.update({
      _id: transactionId
    }, update, function(err, rowsAffected) {
      if (err) {
        res.status(500).send();
        return;
      }
      if (rowsAffected.ok === 1) {
        Checkin.remove({
          username: queueHero
        }, function(err) {
          if (err) {
            res.status(500).send();
            return;
          }
          res.status(204).send();
        });

      } else {
        res.status(500).send();
      }

    });

  },

  removeFromCheckin: function(req, res) {
    var queueHero = req.body.username;

    Checkin.remove({
      username: queueHero
    }, function(err) {
      if (err) {
        res.status(500).send();
        return;
      }
      res.status(204).send();
    });

  },

  getOpenRequests: function(req, res, next) {
    //get location from request
    var vendorYelpId = req.query.vendorYelpId;

    //TODO: (db) find all transactions with yelpId = ^
    //currently this query just gets all transactions that are not complete
    Transaction.find({
      status: 'unfulfilled',
      vendorYelpId: vendorYelpId
    }, function(err, transactions) {
      if (err) {
        res.status(500).send();
        return;
      }
      res.status(200).send(transactions);

    });

  },

  rateRequester: function(req, res, next) {
    //get rating and requester from request
    var rating = req.body.rating;
    var requester = req.body.requester;
    var transactionId = req.body.transactionId;

    User.findOne({
      username: requester
    }, function(err, user) {
      if (err) {
        res.status(500).send();
        return;
      }
      if (!user) {
        res.status(401).send();
        return;
      }
      var ratings = user.ratings;
      ratings.transactionId = rating;
      User.update({
        username: requester
      }, {
        ratings: ratings
      }, function(err, rowsAffected) {
        if (err) {
          res.status(500).send();
          return;
        }
        if (rowsAffected.ok === 1) {
          res.status(204).send();
          return;
        }
        res.status(500).send();
      });


    });

  }
};
