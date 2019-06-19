angular.module('MapsService',[])
.service('mapsService', function($http){

    let getRouteAddresses = async (address)=>{
        try{
            let userLocation = await getCurrentLocation();
            let searchText = processAddress(address); 
            let destinationLocation = await $http.get(`https://geocoder.api.here.com/6.2/geocode.json?app_id=oqFfxHyAxYiXE0EH3RZb&app_code=PFP0AkR26quxCjwNW7mr9w&searchtext=${searchText}`);
            if(destinationLocation.data.Response.View.length == 0) throw "Direccion invalida o inexistente"
            
            let result = {
                firstAddress: {
                    latitude: userLocation.coords.latitude,
                    longitude: userLocation.coords.longitude
                },
                secondAddress: {
                    latitude: destinationLocation.data.Response.View[0].Result[0].Location.DisplayPosition.Latitude,
                    longitude: destinationLocation.data.Response.View[0].Result[0].Location.DisplayPosition.Longitude
                }
            }

            return result;

        }catch(err){
            console.log(err)
        }
    }

    let getCurrentLocation = ()=>{
            return new Promise(function (resolve, reject) {
              navigator.geolocation.getCurrentPosition(resolve, reject);
            });
          }

    let processAddress = (add)=>{
        return add.replace(/\s+/g, '+')
    }

    this.calculateRoutes = async (mapObject, address)=>{

        let addresses = await getRouteAddresses(address)
        let platform = new H.service.Platform({
            'app_id': 'oqFfxHyAxYiXE0EH3RZb',
            'app_code': 'PFP0AkR26quxCjwNW7mr9w'
          });
          console.log(addresses)
          // Retrieve the target element for the map:
          let targetElement = mapObject;
          
          // Get the default map types from the platform object:
          let defaultLayers = platform.createDefaultLayers();
          
          // Instantiate the map:
          let map = new H.Map(
            targetElement,
            defaultLayers.normal.map,
            {
            zoom: 10,
            center: {lat: addresses.firstAddress.latitude, lng: addresses.firstAddress.longitude}
            });
          
          // Create the parameters for the routing request:
          let routingParameters = {
            // The routing mode:
            'mode': 'fastest;car',
            // The start point of the route:
            'waypoint0': `geo!${addresses.firstAddress.latitude},${addresses.firstAddress.longitude}`,
            // The end point of the route:
            'waypoint1': `geo!${addresses.secondAddress.latitude},${addresses.secondAddress.longitude}`,
            // To retrieve the shape of the route we choose the route
            // representation mode 'display'
            'representation': 'display'
          };

          var onResult = function(result) {
            console.log(result)
            var route,
              routeShape,
              startPoint,
              endPoint,
              linestring;
            if(result.response.route) {
            // Pick the first route from the response:
            route = result.response.route[0];
            // Pick the route's shape:
            routeShape = route.shape;
          
            // Create a linestring to use as a point source for the route line
            linestring = new H.geo.LineString();
          
            // Push all the points in the shape into the linestring:
            routeShape.forEach(function(point) {
              var parts = point.split(',');
              linestring.pushLatLngAlt(parts[0], parts[1]);
            });
          
            // Retrieve the mapped positions of the requested waypoints:
            startPoint = route.waypoint[0].mappedPosition;
            endPoint = route.waypoint[1].mappedPosition;
          
            // Create a polyline to display the route:
            var routeLine = new H.map.Polyline(linestring, {
              style: { strokeColor: 'blue', lineWidth: 10 }
            });
          
            // Create a marker for the start point:
            var startMarker = new H.map.Marker({
              lat: startPoint.latitude,
              lng: startPoint.longitude
            });
          
            // Create a marker for the end point:
            var endMarker = new H.map.Marker({
              lat: endPoint.latitude,
              lng: endPoint.longitude
            });
          
            // Add the route polyline and the two markers to the map:
            map.addObjects([routeLine, startMarker, endMarker]);
          
            // Set the map's viewport to make the whole route visible:
            map.setViewBounds(routeLine.getBounds());
            }
          };
          
          // Get an instance of the routing service:
          var router = platform.getRoutingService();
          
          // Call calculateRoute() with the routing parameters,
          // the callback and an error callback function (called if a
          // communication error occurs):
          router.calculateRoute(routingParameters, onResult,
            function(error) {
              alert(error.message);
            });
    }
})