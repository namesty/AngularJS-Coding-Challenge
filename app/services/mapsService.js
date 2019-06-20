angular.module('MapsService', [])
  .service('mapsService', function ($http) {

    /**
     * HERE Maps API Constants
     */

    const routeApiBaseUrl = "https://geocoder.api.here.com";
    const routeApiPath = "/6.2/geocode.json"
    const temperatureApiBaseUrl = "https://weather.api.here.com"
    const temperatureApiPath = "/weather/1.0/report.json"
    const app_id = "oqFfxHyAxYiXE0EH3RZb";
    const app_code = "PFP0AkR26quxCjwNW7mr9w";

    /**
     * Validates address inputted by user and gets coordinates from the user's location and destination
     * @param {string} address Destination address, from user input from the Trip Form, passed by calculateRoutes function
     * @author namesty
     */

    let getRouteAddresses = async (address) => {
      try {
        let userLocation = await getCurrentLocation();
        let searchText = address.replace(/\s+/g, '+');
        let destinationLocation = await $http.get(`${routeApiBaseUrl}${routeApiPath}?app_id=${app_id}&app_code=${app_code}&searchtext=${searchText}`);
        if (destinationLocation.data.Response.View.length == 0) throw "Direccion invalida o inexistente";

        console.log(destinationLocation);

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

      } catch (err) {
        console.log(err)
      }
    }

    /**
     * Helper function that wraps HTML5 Geolocation API in a promise to get user's location
     * @author namesty
     */

    let getCurrentLocation = () => {
      return new Promise(function (resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
    }

    /**
     * Calculates and renders the routes between two addresses, the user's current one and his destination
     * Taken from Here Maps API Documentation
     * @param {HTMLElement} mapObject reference to the map HTML element which will render the routes
     * @param {string} address inputted by user in previous form
     * @author namesty
     */

    this.calculateRoutes = async (mapObject, address) => {

      let addresses = await getRouteAddresses(address)
      let platform = new H.service.Platform({
        'app_id': app_id,
        'app_code': app_code
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
          center: { lat: addresses.firstAddress.latitude, lng: addresses.firstAddress.longitude }
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

      // Local onResult callback function
      let onResult = (result) => {
        console.log(result)
        try {
          let route,
            routeShape,
            startPoint,
            endPoint,
            linestring;
          if (result.response.route) {
            // Pick the first route from the response:
            route = result.response.route[0];
            // Pick the route's shape:
            routeShape = route.shape;

            // Create a linestring to use as a point source for the route line
            linestring = new H.geo.LineString();

            // Push all the points in the shape into the linestring:
            routeShape.forEach(function (point) {
              let parts = point.split(',');
              linestring.pushLatLngAlt(parts[0], parts[1]);
            });

            // Retrieve the mapped positions of the requested waypoints:
            startPoint = route.waypoint[0].mappedPosition;
            endPoint = route.waypoint[1].mappedPosition;

            // Create a polyline to display the route:
            let routeLine = new H.map.Polyline(linestring, {
              style: { strokeColor: 'blue', lineWidth: 10 }
            });

            // Create a marker for the start point:
            let startMarker = new H.map.Marker({
              lat: startPoint.latitude,
              lng: startPoint.longitude
            });

            // Create a marker for the end point:
            let endMarker = new H.map.Marker({
              lat: endPoint.latitude,
              lng: endPoint.longitude
            });

            // Add the route polyline and the two markers to the map:
            map.addObjects([routeLine, startMarker, endMarker]);

            // Set the map's viewport to make the whole route visible:
            map.setViewBounds(routeLine.getBounds());
          } else {
            throw "No route available"
          }
        } catch (err) {
          console.log(err)
        }

      };

      // Get an instance of the routing service:
      let router = platform.getRoutingService();

      // Call calculateRoute() with the routing parameters,
      // the callback and an error callback function (called if a
      // communication error occurs):
      router.calculateRoute(routingParameters, onResult,
        function (error) {
          alert(error.message);
        });
    }

    /**
     * Gets temperature from the city the user set as his destination in previous form
     * @param {string} address that the user inputted
     */

    this.getTemperature = async (address) => {
      let name = address.replace(/\s+/g, '+');
      let destinationLocation = await $http.get(`https://cors-anywhere.herokuapp.com/${temperatureApiBaseUrl}${temperatureApiPath}?app_id=${app_id}&app_code=${app_code}&product=observation&name=${name}`);
      let result = {
        degrees: destinationLocation.data.observations.location[0].observation[0].temperature,
        city: destinationLocation.data.observations.location[0].city
      }
      return result;
    }
  })