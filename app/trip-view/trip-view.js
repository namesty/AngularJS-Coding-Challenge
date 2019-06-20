'use strict';

angular.module('myApp.trip-view', [
  'ngRoute',
  'ReservationService',
  'MapsService',
  'HereMap'
])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/trip-view', {
      templateUrl: 'trip-view/trip-view.html',
      controller: 'TripviewCtrl',
      css: 'trip-view/trip-view.css'
    });
  }])

  .controller('TripviewCtrl', ['$scope', 'reservationService', '$location', 'mapsService', function ($scope, reservationService, $location, mapsService) {
    $scope.reservation = reservationService.get()

    /**
     * Returns to previous form and resets it through its service if the remember box was not checked
     * @author namesty
     */
    $scope.editReservation = () => {
      if (!$scope.reservation.remember) reservationService.delete();
      $location.path('/trip-form');
    }

  }]);