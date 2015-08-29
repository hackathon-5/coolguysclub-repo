'use strict';

// Carpools controller
angular.module('carpools').controller('CarpoolsController',[
	'$scope', '$stateParams', '$location', '$modal', '$log', 'Authentication', 'Carpools', '$timeout',
	function($scope, $stateParams, $location, $modal, $log, Authentication, Carpools, $timeout) {
		$scope.authentication = Authentication;

		$scope.pageView = 'LIST';
		$scope.search = {};

		if(!$scope.authentication.user) {
			$location.path('/signin');
		}

		$scope.init = function() {
			$scope.find();
			$scope.initSearch();
		};

		$scope.initSearch = function() {
			var autocomplete = new google.maps.places.Autocomplete(document.getElementById('destination'));
			autocomplete.addListener('place_changed', function() {
				var place = autocomplete.getPlace();

				$scope.placeSearch = {
					name: place.name,
					location: {
						lat: place.geometry.location.G,
						lng: place.geometry.location.K
					}
				};
			});
		};

		$scope.canShowDrive = function() {
			return true;
		};

		$scope.drive = function () {
			var modalInstance = $modal.open({
				animation: true,
				templateUrl: 'modules/carpools/views/register-ride.client.view.html',
				controller: 'RegisterRideController',
				resolve: {
					carpool: function() {
						var result = new Carpools();

						if ($scope.placeSearch) {
							result.destination = {
								name: $scope.placeSearch.name,
								location: {
									lat: $scope.placeSearch.location.lat,
									lng: $scope.placeSearch.location.lng
								}
							};
						}

						return result;
					}
				}
			});
			modalInstance.result.then(function (carpool) {
				$log.info(carpool);

				$scope.carpools.push(carpool);
				$location.path('carpools/' + carpool._id);
			}, function () {
				$scope.search = {};
				$log.info('Modal dismissed at: ' + new Date());
			});
		};

		$scope.joinCarpool = function(carpool) {
			carpool.riders.push($scope.authentication.user._id);

			carpool.$update(function(response) {
				$location.path('carpools/' + carpool._id);
			}, function(errorResponse) {
				carpool.riders.pop();
				$scope.error = errorResponse.data.message;
			});

		};

		$scope.unjoinCarpool = function(carpool) {
			var rider;
			for (var i in carpool.riders) {
				if (carpool.riders[i]._id === $scope.authentication.user._id) {
					rider = carpool.riders[i];
					carpool.riders.splice(i, 1);
				}
			}

			carpool.$update(function() {
				$location.path('/');
			}, function(errorResponse) {
				if(rider) {
					carpool.riders.push(rider);
				}
				$scope.error = errorResponse.data.message;
			});

		};


		// Create new Carpool
		$scope.create = function() {
			// Create new Carpool object
			var carpool = new Carpools ({
				name: this.name
			});

			// Redirect after save
			carpool.$save(function(response) {
				$location.path('carpools/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Carpool
		$scope.remove = function(carpool) {
			if ( carpool ) { 
				carpool.$remove();

				for (var i in $scope.carpools) {
					if ($scope.carpools [i] === carpool) {
						$scope.carpools.splice(i, 1);
					}
				}
			} else {
				$scope.carpool.$remove(function() {
					$location.path('carpools');
				});
			}
		};

		// Update existing Carpool
		$scope.update = function() {
			var carpool = $scope.carpool;

			carpool.$update(function() {
				$location.path('carpools/' + carpool._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Carpools
		$scope.find = function() {
			Carpools.query(function(carpools) {
				// check if they have a carpool already
				var myCarpool = findUserCarpool(carpools);
				if (myCarpool) {
					// route to summary
					$location.path('carpools/' + myCarpool._id);
				}

				// remove car pools without seats
				for (var i=0; i<carpools.length; i++) {
					var carpool = carpools[i];

					if (!$scope.canJoinCarPool(carpool)) {
						carpools.splice(i, 1);
						i--;
					}
				}

				$scope.carpools = carpools;

			});
		};

		function findUserCarpool(carpools) {
			for (var i=0; i<carpools.length; i++) {
				var carpool = carpools[i];

				// check driver name
				if (carpool.user._id === $scope.authentication.user._id) {
					return carpool;
				}

				// check for rider status
				for (var j=0; j<carpool.riders.length; j++) {
					var rider = carpool.riders[j];

					if (rider._id === $scope.authentication.user._id) {
						return carpool;
					}
				}
			}

			return undefined;
		}

		// Find existing Carpool
		$scope.findOne = function() {
			Carpools.get({
				carpoolId: $stateParams.carpoolId
			}, function(carpool) {

				// check if expired
				if (carpool.expired) {
					$location.path('/');
				}

				$scope.carpool = carpool;
			});
		};

		$scope.getRiders = function(carpool) {
			var riders = '';

			if (carpool && carpool.riders && carpool.riders.length > 0) {
				riders += carpool.riders[0].displayName;

				for (var i=1; i<carpool.riders.length; i++) {
					riders += ', ' + carpool.riders[i].displayName;
				}
			}

			return riders;
		};

		$scope.isRider = function(rider) {
			return rider._id === $scope.authentication.user._id;
		};

		$scope.canJoinCarPool = function(carpool) {
			var result = true;

			if (carpool.numSeats - carpool.riders.length <= 0) {
				result = false;
			} else if (carpool.departureTime < new Date()) {
				result = false;
			}

			return result;
		};

		$scope.delay = (function() {
			var promise = null;
			return function(callback, ms) {
				$timeout.cancel(promise); //clearTimeout(timer);
				promise = $timeout(callback, ms); //timer = setTimeout(callback, ms);
			};
		})();
	}
]);
