'use strict';

// Carpools controller
angular.module('carpools').controller('RegisterRideController',[
    '$scope', '$stateParams', '$location', '$modalInstance', 'Authentication', 'Carpools',
    function($scope, $stateParams, $location, $modalInstance, Authentication, Carpools) {
        $scope.authentication = Authentication;

        $scope.carpool = new Carpools();

        $scope.ok = function () {
            $scope.carpool.$save(function() {

                $modalInstance.close($scope.carpool);

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

    }
]);
