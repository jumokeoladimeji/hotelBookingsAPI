var express = require('express'),
  mongoose = require('mongoose'),
  needle = require('needle'),
  Hotels = require('../../models/hotels'),
  _ = require('lodash');

var jwt = require('jsonwebtoken');
var async = require('async');


var saveToMongo = function(hotels) {
  // Potato.collection.insert(potatoBag, onInsert);
  Hotels.remove({}, function(err) {
    if (err) {
      return;
    };
    Hotels.collection.insert(hotels, function(err) {
      if (err) {
        res.send({
          data: err
        });
      }
      console.log('saved to mongo');
      return;
    });
  });
};

module.exports = function(app) {
  app.route('/api/saveAllHotels').get(function(req, res) {
    var hotels = [];
    var page = 1;
    var getAllHotels = function() {
      var url = 'public.api.hotels.ng/api/api.php?cmd=get_all_hotels&page=' + page + '&hotels_per_page=100';
      console.log(url);
      needle.get(url, function(error, response) {
        var responseObj;
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
          //
          // if json.parse fails, there's no responseObj
          if (!responseObj || responseObj.length < 100) {
            console.log('finished getting all hotels');
            // save to mongo
            saveToMongo(hotels);
            // and stop
            return;
          }
          getAllHotels();
        }
      });
    };
    getAllHotels();
  });

  app.route('/api/getByState/:statename').get(function(req, res) {
    var statename = req.params.statename;
    Hotels.find({
      'statename': statename
    }, function(err, hotels) {
      if (err) {
        res.send({
          err: err
        });
      }
      res.json({
        count: hotels.length,
        data: hotels
      });
    });
  });

  app.route('/api/getByCity/:city').get(function(req, res) {
    var city = req.params.city;
    Hotels.find({
      'city': city
    }, function(err, hotels) {
      if (err) {
        res.send({
          err: err
        });
      }
      res.json({
        count: hotels.length,
        data: hotels
      });
    });
  });

};
// [{"id":"91719","name":"Prince Hotel","city":"Kano","statename":"Kano","total":"9777","images":[{"id":"261","image":"http://public.api.hotels.ng/slir/w611-h459-c4x3/views/91719/prince-hotel-kano-261.jpeg","thumbnail":"http://public.api.hotels.ng/slir/w80-h48-c81x49/views/91719/prince-hotel-kano-261.jpeg"},{"id":"257","image":"http://public.api.hotels.ng/slir/w611-h459-c4x3/views/91719/prince-hotel-kano-257.jpeg","thumbnail":"http://public.api.hotels.ng/slir/w80-h48-c81x49/views/91719/prince-hotel-kano-257.jpeg"},{"id":"258","image":"http://public.api.hotels.ng/slir/w611-h459-c4x3/views/91719/prince-hotel-kano-258.jpeg","thumbnail":"http://public.api.hotels.ng/slir/w80-h48-c81x49/views/91719/prince-hotel-kano-258.jpeg"},{"id":"259","image":"http://public.api.hotels.ng/slir/w611-h459-c4x3/views/91719/prince-hotel-kano-259.jpeg","thumbnail":"http://public.api.hotels.ng/slir/w80-h48-c81x49/views/91719/prince-hotel-kano-259.jpeg"},{"id":"260","image":"http://public.api.hotels.ng/slir/w611-h459-c4x3/views/91719/prince-hotel-kano-260.jpeg","thumbnail":"http://public.api.hotels.ng/slir/w80-h48-c81x49/views/91719/prince-hotel-kano-260.jpeg"},{"id":"262","image":"http://public.api.hotels.ng/slir/w611-h459-c4x3/views/91719/prince-hotel-kano-262.jpeg","thumbnail":"http://public.api.hotels.ng/slir/w80-h48-c81x49/views/91719/prince-hotel-kano-262.jpeg"},{"id":"263","image":"http://public.api.hotels.ng/slir/w611-h459-c4x3/views/91719/prince-hotel-kano-263.jpeg","thumbnail":"http://public.api.hotels.ng/slir/w80-h48-c81x49/views/91719/prince-hotel-kano-263.jpeg"}],"rating":[],"facilities":[{"id":"100","hotel_id":"91719","facility_id":"100","available":"0","comment":"","name":"Restaurant(s) ","type":"General","description":"","icon":"restaurant.png"},{"id":"101","hotel_id":"91719","facility_id":"101","available":"0","comment":"","name":"Bar/Lounge","type":"General","description":"","icon":"bar.png"},{"id":"103","hotel_id":"91719","facility_id":"103","available":"0","comment":"","name":"Security","type":"General","description":"","icon":"security.png"},{"id":"105","hotel_id":"91719","facility_id":"105","available":"0","comment":"","name":"Wireless Internet","type":"General","description":"","icon":"wireless.png"},{"id":"107","hotel_id":"91719","facility_id":"107","available":"0","comment":"","name":"Air Condition","type":"General","description":"","icon":"star.png"},{"id":"108","hotel_id":"91719","facility_id":"108","available":"0","comment":"","name":"24 Electricity","type":"General","description":"","icon":"electricity.png"},{"id":"179","hotel_id":"91719","facility_id":"179","available":"0","comment":"","name":"Adequate Parking Space","type":"Rooms","description":"","icon":"parking.png"},{"id":"180","hotel_id":"91719","facility_id":"180","available":"0","comment":"","name":"Swimming Pool","type":"Rooms","description":"","icon":"swimming.png"}]}
