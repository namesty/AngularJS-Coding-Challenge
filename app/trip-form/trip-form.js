'use strict';

angular.module('myApp.trip-form', [
  'ngRoute',
  'ReservationService'
])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/trip-form', {
    templateUrl: 'trip-form/trip-form.html',
    controller: 'TripformCtrl'
  });
}])

.controller('TripformCtrl', ['$scope', 'reservationService', function($scope, reservationService) {

  $scope.findReservation = ()=>{

    $scope.reservation = {
      number: $scope.number,
      lastName: $scope.lastName,
      ship: $scope.ship,
      sailDate: `${$scope.month}-${$scope.day}-${$scope.year}`,
      remember: $scope.remember
    }

    reservationService.add($scope.reservation)

    console.log(reservationService.get())
  }
}]);