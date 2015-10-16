var express = require('express'),
  mongoose = require('mongoose'),
  needle = require('needle'),
  Hotels = require('../../models/hotels'),
  request = require('request'),
  _ = require('lodash');

var jwt = require('jsonwebtoken');
var async = require('async');


var saveToMongo = function(hotels) {
  Hotels.remove({}, function(err) {
    if (err) {
      return;
    }
    Hotels.collection.insert(hotels, function(err) {
      if (err) {
        res.send({
          data: err
        });
      }
      return;
    });
  });
};

module.exports = function(app) {
  // TODO: Have a script that does this at intervals

  app.route('/api/saveAllHotels').get(function(req, res) {
    var hotels = [];
    var page = 1;
    var getAllHotels = function() {
      var url = 'public.api.hotels.ng/api/api.php?cmd=get_all_hotels&page=' + page + '&hotels_per_page=100';
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
    //get by small letter and get by capital letter
    //
    //{name: new RegExp('^'+name+'$', "i")
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

  // /api/v1/hotels/:city
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

  // /api/v1/hotels/:hotelId/details
  // after selecting a hotel get all rooms in that hotel
  app.route('/api/getHotelDetails/:hotelId').get(function(req, res) {
    var hotelId = req.params.hotelId;
    var url = 'http://public.api.hotels.ng/api/api.php?cmd=get_hotel_details&hotel_id=' + hotelId;
    needle.get(url, function(error, response) {
      var responseArray;
      if (error) {
        res.status(500).send({
          message: error
        });
      }
      if (!error && response.statusCode == 200) {
        try {
          responseArray = JSON.parse(response.body).data;

        } catch (e) {
          console.log(e);
        }
        res.status(200).send({
          count: responseArray.length,
          data: responseArray
        });
      }

    });
  });



  // /api/v1/hotels/:hotelId/rooms
  app.route('/api/getHotelRooms/:hotelId').get(function(req, res) {
    var hotelId = req.params.hotelId;
    var url = 'http://public.api.hotels.ng/api/api.php?cmd=get_hotel_rooms&hotel_id=' + hotelId;
    needle.get(url, function(error, response) {
      var responseArray;
      if (error) {
        res.status(500).send({
          message: error
        });
      }
      if (!error && response.statusCode == 200) {
        try {
          responseArray = JSON.parse(response.body).data;

        } catch (e) {
          console.log(e);
        }
        res.status(200).send({
          count: responseArray.length,
          data: responseArray
        });
      }

    });
  });

  //change this to a GET
  app.route('/api/getHotelBookingInfo').post(function(req, res) {
    var url = 'http://public.api.hotels.ng/api/api.php?cmd=get_booking_total_cost';
    var data = req.body;
    needle.post(url, data, function(error, response) {
      var responseObj;
      var body = JSON.stringify(response.body);
      try {
          responseObj = JSON.parse(response.body).data;

        } catch (e) {
          console.log(e);
        }
      if (error) {
        var errMessage = error.substr(error.indexOf('{"status"'));
        res.status(500).send({
          message: errMessage,
        });
      }
      if (!error && response.statusCode == 200) {
        res.status(200).send({
          data: responseObj
        });
      }

    });

  });


  app.route('/api/bookHotel').post(function(req, res) {
    var url = 'http://public.api.hotels.ng/api/api.php?cmd=make_booking';
    var data = req.body;

    needle.post(url, data, function(error, response) {
      var responseObj;
      try {
        responseObj = JSON.parse(response.body);

      } catch (e) {
        console.log(e);
      }
      if (error) {
        var errMessage = error.substr(error.indexOf('{"status"'));
        res.status(500).send({
          message: errMessage,
        });
      }
      if (responseObj.status === "error") {
        res.status(500).send(responseObj);
      } else if (!error && (response.statusCode === 200) && (responseObj.status != "error")) {
        res.status(200).send({
          data: responseObj
        });
      }
    });
  });

};
