'use strict';

// Carpools controller
angular.module('carpools').controller('MapsController',[
    '$scope', '$filter', 'Authentication', 'Carpools',
    function($scope, $filter, Authentication, Carpools) {
        $scope.authentication = Authentication;

        $scope.initMap = function() {
            $scope.latitutde = 32.8678379;
            $scope.longitude = -79.9149789;
            $scope.zoom = 11;

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

            $scope.generateMarkers();
        };

        $scope.generateMarkers = function() {
            angular.forEach($scope.carpools, function(carpool) {
                var marker = new google.maps.Marker({
                    position: carpool.destination.location,
                    map: $scope.map
                });
                var contentString = '<h4>' + carpool.destination.name + '</h4>' +
                                    '<div class="text-center">' + $filter('date')(carpool.departureTime, 'h:mm a') + ' - ' +
                                    $filter('date')(carpool.returnTime, 'h:mm a') + '</div>' +
                                    '<div class="text-center"> Seats: ' + carpool.numSeats + '</div>' +
                    '<div class="text-center"><a href="#!/carpools/'+ carpool._id + '/join"><button type="button" class="btn btn-warning">Join!</button></a></div>';
                var infoWindow = new google.maps.InfoWindow({
                    content: contentString
                });
                marker.addListener('click', function() {
                    infoWindow.open($scope.map, marker);
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
