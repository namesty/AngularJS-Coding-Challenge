'use strict';

angular.module('myApp.trip-view', [
  'ngRoute',
  'ReservationService'
])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/trip-view', {
    templateUrl: 'trip-view/trip-view.html',
    controller: 'TripviewCtrl'
  });
}])

.controller('TripviewCtrl', ['$scope', 'reservationService', function($scope, reservationService) {
  console.log(reservationService.get());
}]);