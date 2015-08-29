'use strict';

//Setting up route
angular.module('carpools').config(['$stateProvider',
	function($stateProvider) {
		// Carpools state routing
		$stateProvider
			.state('listCarpools', {
				url: '/',
				templateUrl: 'modules/carpools/views/list-carpools.client.view.html'
			})
			.state('viewCarpool', {
				url: '/carpools/:carpoolId',
				templateUrl: 'modules/carpools/views/view-carpool.client.view.html'
			})
			.state('joinCarpool', {
				url: '/carpools/:carpoolId/join',
				controller: function($stateParams, $location, Carpools, Authentication) {
					var authentication = Authentication;

					Carpools.get({carpoolId: $stateParams.carpoolId}, function(carpool) {
						carpool.riders.push(authentication.user._id);
						carpool.$update(function() {
							$location.path('carpools/' + carpool._id);
						}, function(errorResponse) {
							carpool.riders.pop();
							$location.path('/');
							$scope.error = errorResponse.data.message;
						});
					});

				}
			});
	}
]);
