'use strict';

// Carpools controller
angular.module('carpools').controller('CarpoolsController',[
	'$scope', '$stateParams', '$location', '$modal', '$log', 'Authentication', 'Carpools',
	function($scope, $stateParams, $location, $modal, $log, Authentication, Carpools) {
		$scope.authentication = Authentication;

		$scope.registerRide = function () {
			var modalInstance = $modal.open({
				animation: true,
				templateUrl: 'modules/carpools/views/register-ride.client.view.html',
				controller: 'RegisterRideController'
			});
			modalInstance.result.then(function (carpool) {
				$log.info(carpool);

				$scope.carpools.push(carpool);
			}, function () {
				$log.info('Modal dismissed at: ' + new Date());
			});
		};

		$scope.joinCarpool = function(carpool) {
			//console.log($scope.authentication.user);

			carpool.riders.push($scope.authentication.user._id);

			carpool.$update(function(response) {
				//$location.path('carpools/' + response._id);

				console.log(response);

			}, function(errorResponse) {
				carpool.riders.pop();

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
			$scope.carpools = Carpools.query();
		};

		// Find existing Carpool
		$scope.findOne = function() {
			$scope.carpool = Carpools.get({ 
				carpoolId: $stateParams.carpoolId
			});
		};
	}
]);
