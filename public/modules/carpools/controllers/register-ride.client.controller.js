'use strict';

// Carpools controller
angular.module('carpools').controller('RegisterRideController',[
    '$scope', '$stateParams', '$location', '$modalInstance', 'Authentication', 'Carpools', 'carpool',
    function($scope, $stateParams, $location, $modalInstance, Authentication, Carpools, carpool) {
        $scope.authentication = Authentication;

        $scope.carpool = carpool;

        $scope.ok = function () {
            $scope.carpool.$save(function() {
                $modalInstance.close($scope.carpool);
            }, function(errorResponse) {
                if (errorResponse.status === 401) {
                    $modalInstance.close(undefined);
                }

                $scope.error = errorResponse.data.message;
            });
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

    }
]);
