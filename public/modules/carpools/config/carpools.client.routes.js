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
			});
	}
]);
