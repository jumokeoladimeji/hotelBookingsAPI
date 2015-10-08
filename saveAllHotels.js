var express = require('express'),
  mongoose = require('mongoose'),
  needle = require('needle'),
  Hotels = require('./app/models/hotels'),
  request = require('request'),
  _ = require('lodash');

var jwt = require('jsonwebtoken');
var async = require('async');

module.exports = function() {
  var hotels = [];
  var page = 1;
  async.waterfall([
    function getAllHotels(cb) {
      var responseObj;
      var url = 'public.api.hotels.ng/api/api.php?cmd=get_all_hotels&page=' + page + '&hotels_per_page=100';
      console.log('page', page);
      needle.get(url, function(error, response) {
        var body = response.body;
        if (error) {
          res.send({
            message: error
          });
        }
        if (!error && response.statusCode == 200) {
          try {
            body = body.substr(body.indexOf('{"status"'));
            responseObj = JSON.parse(body).data;
          } catch (e) {
            console.log(e);
          }
          if (responseObj) {
            hotels = hotels.concat(responseObj);
          }
          page++;

          if (!responseObj || responseObj.length < 100) {
            return cb(null, hotels);
          }
          getAllHotels(cb);
        }
      });
    }
  ], function(err, hotels) {
    Hotels.remove({}, function(err) {
      if (err) {
        console.log('error deleting previous hotels:', err);
        return;
      }
      Hotels.collection.insert(hotels, function(err) {
        if (err) {
          console.log('error inserting hotels:', err);
        }
        console.log('successfully saved all hotels');
        return;
      });
    });
  });
};
