'use strict';

angular.module('myApp.trip-view', [
  'ngRoute',
  'ReservationService',
  'MapsService'
])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/trip-view', {
    templateUrl: 'trip-view/trip-view.html',
    controller: 'TripviewCtrl'
  });
}])

.controller('TripviewCtrl', ['$scope', 'reservationService', '$location', 'mapsService', function($scope, reservationService, $location, mapsService) {
  $scope.reservation = reservationService.get()

  let response = (async ()=>{
    if($scope.reservation.address)
    await mapsService.sendAddress($scope.reservation.address)
  })();
  console.log(response)

  $scope.editReservation = ()=>{
    if(!$scope.reservation.remember) reservationService.delete();
    $location.path('/trip-form');
  }
}]);