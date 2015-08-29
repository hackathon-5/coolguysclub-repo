'use strict';

//Setting up route
angular.module('carpools').config(['$stateProvider',
	function($stateProvider) {
		// Carpools state routing
		$stateProvider.
		state('listCarpools', {
			url: '/',
			templateUrl: 'modules/carpools/views/list-carpools.client.view.html'
		}).
		state('createCarpool', {
			url: '/carpools/create',
			templateUrl: 'modules/carpools/views/create-carpool.client.view.html'
		}).
		state('viewCarpool', {
			url: '/carpools/:carpoolId',
			templateUrl: 'modules/carpools/views/view-carpool.client.view.html'
		}).
		state('editCarpool', {
			url: '/carpools/:carpoolId/edit',
			templateUrl: 'modules/carpools/views/edit-carpool.client.view.html'
		});
	}
]);
