/**
 * @ngdoc overview
 * @name andelaNotesApp
 * @description
 * # andelaNotesApp
 *
 * Main module of the application.
 */
var app = angular.module('hotelBookings', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.bootstrap'
]);
app.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'MainCtrl',
            controllerAs: 'main'
        })
        .otherwise({
            redirectTo: '/'
        });
});
