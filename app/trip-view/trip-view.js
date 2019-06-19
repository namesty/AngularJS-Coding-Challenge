'use strict';

angular.module('myApp.trip-view', [
  'ngRoute',
  'ReservationService',
  'MapsService'
])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/trip-view', {
    templateUrl: 'trip-view/trip-view.html',
    controller: 'TripviewCtrl',
    css: 'trip-view/trip-view.css'
  });
}])

.controller('TripviewCtrl', ['$scope', 'reservationService', '$location', 'mapsService', function($scope, reservationService, $location, mapsService) {
  $scope.reservation = reservationService.get()

  let response = (async ()=>{
    if($scope.reservation.address)
    try{
      $scope.loading = true;
      await mapsService.calculateRoutes(document.getElementById("mapContainer"),$scope.reservation.address);
    }catch(err){
      console.log(err);
    }finally{
      $scope.loading = false;
      console.log($scope.loading)
    } 
  })();
 

  $scope.editReservation = ()=>{
    if(!$scope.reservation.remember) reservationService.delete();
    $location.path('/trip-form');
  }



}]);