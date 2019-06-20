angular.module('HereMap', [
    'MapsService'
]).
    component('hereMap', {
        templateUrl: 'components/here-map/here-map.html',
        bindings: {
            searchAddress: '<'
        },
        controller: function HereMapController(mapsService, $scope) {
            let ctrl = this;
            $scope.tempUnit = "celsius";
            $scope.temp = 0;
            $scope.city = "Destination"
            $scope.show = true;
            $scope.loading = false;

            /**
             * On Init function gets temperatures and routes from addresses and renders them on the map
             * @author namesty
             */

            ctrl.$onInit = async () => {
                if (ctrl.searchAddress)
                    try {
                        $scope.loading = true;
                        await mapsService.calculateRoutes(document.getElementById("mapContainer"), ctrl.searchAddress);
                        let temperatureData = await mapsService.getTemperature(ctrl.searchAddress);
                        $scope.temp = temperatureData.degrees;
                        $scope.city = temperatureData.city;
                        $scope.loading = false;
                        $scope.$apply();
                    } catch (err) {
                        console.log(err);
                        $scope.show = false;
                        $scope.$apply();
                    }
            }

            /**
             * Converts the temperature value from the scope to Celsius or Farenheit
             * @author namesty
             */

            $scope.changeTempUnit = () => {
                console.log($scope)
                if ($scope.tempUnit == "celsius") {
                    $scope.temp = ($scope.temp * (9 / 5)) + 32;
                } else {
                    $scope.temp = ($scope.temp - 32) * (5 / 9);
                }
            }
        }


    });