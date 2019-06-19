'use strict';

angular.module('myApp.trip-form', [
  'ngRoute',
  'ReservationService'
])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/trip-form', {
    templateUrl: 'trip-form/trip-form.html',
    controller: 'TripformCtrl',
    css: 'trip-form/trip-form.css'
  });
}])

.controller('TripformCtrl', ['$scope', 'reservationService', '$location', function($scope, reservationService, $location) {
  $scope.reservation = reservationService.get();
  
  $scope.findReservation = ()=>{
    reservationService.add($scope.reservation)
    $location.path("/trip-view")
  }
}]);