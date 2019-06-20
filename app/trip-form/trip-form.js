'use strict';

angular.module('myApp.trip-form', [
  'ngRoute',
  'ReservationService',
  'DateService'
])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/trip-form', {
      templateUrl: 'trip-form/trip-form.html',
      controller: 'TripformCtrl',
      css: 'trip-form/trip-form.css'
    });
  }])

  .controller('TripformCtrl', ['$scope', 'reservationService', '$location', 'dateService', function ($scope, reservationService, $location, dateService) {
    $scope.dates = dateService.initDateData();
    $scope.ships = ['CELEBRITY CONSTELLATION', 'CELEBRITY GALAXY', 'CELEBRITY UNIVERSE']
    $scope.reservation = reservationService.get();

    /**
     * Submit method for the Trip Form form, if $valid, navigates to Trip View
     * @author namesty
     */
    $scope.findReservation = () => {
      reservationService.add($scope.reservation)
      $location.path("/trip-view")
    }

    /**
     * Calls helper function to dynamically populate the days select input
     * @author namesty
     */
    $scope.changeDays = () => {
      $scope.dates.days = dateService.changeDays($scope.reservation.month, $scope.reservation.year);
    }


  }]);