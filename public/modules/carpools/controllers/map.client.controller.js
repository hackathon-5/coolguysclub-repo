'use strict';

// Carpools controller
angular.module('carpools').controller('MapsController',[
    '$scope', 'Authentication', 'Carpools',
    function($scope, Authentication, Carpools) {
        $scope.authentication = Authentication;

        $scope.initMap = function() {
            $scope.latitutde = 32.8678379;
            $scope.longitude = -79.9149789;
            $scope.zoom = 12;

            $scope.location = new google.maps.LatLng(
                $scope.latitutde,
                $scope.longitude
            );

            $scope.mapOptions = {
                zoom: $scope.zoom,
                center: $scope.location
            };

            $scope.map = new google.maps.Map(document.getElementById('map'), $scope.mapOptions);

            $scope.geocoder = new google.maps.Geocoder();

            //$scope.generateMarkers();
        };

        $scope.generateMarkers = function() {
            angular.forEach($scope.carpools, function(carpool) {
                var location = $scope.getLocation("test");
                new google.maps.Marker({
                    position: location,
                    map: $scope.map
                });
            });
        };

        $scope.getLocation = function(location) {
            if(location && location !== '') {
                $scope.geocoder.geocode({'address': location}, function (response) {
                    if(response) {
                        return (response[0].geometry.location);
                    }
                });
            }
        };

    }
]);
