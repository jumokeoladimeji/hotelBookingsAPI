// /**
//  * Module dependencies.
//  */
// var express = require('express'),
//     mongoose = require('mongoose'),
//     User = require('../models/user'),
//     jwt = require('jsonwebtoken');
// var SECRET = 'shhhhhhared-secret';

// // self.parseJwt = function(token) {
// //     var base64Url = token.split('.')[1];
// //     var base64 = base64Url.replace('-', '+').replace('_', '/');
// //     return JSON.parse($window.atob(base64));
// // };

// module.exports = function(app, config) {
//     app.route('/user/signup').post(function(req, res) {
//         User.findOne({
//                 email: req.body.email,
//                 username: req.body.username,
//                 password: req.body.password
//             },
//             function(err, user) {
//                 if (err) {
//                     console.log('err', err);
//                     res.json({
//                         type: false,
//                         data: "Error occured: " + err
//                     });
//                 } else {
//                     if (user) {
//                         console.log('err user presenst');
//                         res.json({
//                             type: false,
//                             data: "User already exists!"
//                         });
//                     } else {
//                         console.log('adding to user');
//                         var userModel = new User();
//                         userModel.email = req.body.email;
//                         userModel.password = req.body.password;
//                         userModel.username = req.body.username;

//                         userModel.save(function(err, user) {
//                             var token = jwt.sign(user, SECRET);
//                             user.token = token.toString();

//                             user.save(function(err, user1) {
//                                 console.log(user1);
//                                 res.send({
//                                     type: true,
//                                     data: user1,
//                                     token: user1.token,
//                                     message: "User Successfully Registered"
//                                 });
//                             });
//                         });
//                     }
//                 }

//             });
//     });
//     /**
//      * Signin
//      */

//     app.route('/user/signin').post(function(req, res) {
//         if (!req.body.username || !req.body.password) {
//             return res.status(400).json({
//                 message: 'Please fill out all fields'
//             });
//         } else {

//             User.findOne({
//                     username: req.body.username,
//                     password: req.body.password
//                 },
//                 function(err, user) {
//                     if (err || !user) {
//                         var message = !user ? "User not found" : err;
//                         var status = !user ? 401 : 500;

//                         res.status(status).send({
//                             type: false,
//                             data: "Error occured: " + message
//                         });
//                     } else {
//                         res.send({
//                             type: true,
//                             data: user
//                         });
//                     }
//                 });
//         }
//     });

//     /**
//      * Signout
//      */
//     app.route('/user/signout').get(function(req, res) {
//         req.logout();
//         res.redirect('/');
//     });

// };
