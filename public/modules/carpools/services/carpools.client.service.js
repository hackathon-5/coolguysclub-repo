'use strict';

//Carpools service used to communicate Carpools REST endpoints
angular.module('carpools').factory('Carpools', ['$resource',
	function($resource) {
		return $resource('carpools/:carpoolId', { carpoolId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);