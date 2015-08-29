'use strict';

(function() {
	// Carpools Controller Spec
	describe('Carpools Controller Tests', function() {
		// Initialize global variables
		var CarpoolsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Carpools controller.
			CarpoolsController = $controller('CarpoolsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Carpool object fetched from XHR', inject(function(Carpools) {
			// Create sample Carpool using the Carpools service
			var sampleCarpool = new Carpools({
				name: 'New Carpool'
			});

			// Create a sample Carpools array that includes the new Carpool
			var sampleCarpools = [sampleCarpool];

			// Set GET response
			$httpBackend.expectGET('carpools').respond(sampleCarpools);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.carpools).toEqualData(sampleCarpools);
		}));

		it('$scope.findOne() should create an array with one Carpool object fetched from XHR using a carpoolId URL parameter', inject(function(Carpools) {
			// Define a sample Carpool object
			var sampleCarpool = new Carpools({
				name: 'New Carpool'
			});

			// Set the URL parameter
			$stateParams.carpoolId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/carpools\/([0-9a-fA-F]{24})$/).respond(sampleCarpool);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.carpool).toEqualData(sampleCarpool);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Carpools) {
			// Create a sample Carpool object
			var sampleCarpoolPostData = new Carpools({
				name: 'New Carpool'
			});

			// Create a sample Carpool response
			var sampleCarpoolResponse = new Carpools({
				_id: '525cf20451979dea2c000001',
				name: 'New Carpool'
			});

			// Fixture mock form input values
			scope.name = 'New Carpool';

			// Set POST response
			$httpBackend.expectPOST('carpools', sampleCarpoolPostData).respond(sampleCarpoolResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Carpool was created
			expect($location.path()).toBe('/carpools/' + sampleCarpoolResponse._id);
		}));

		it('$scope.update() should update a valid Carpool', inject(function(Carpools) {
			// Define a sample Carpool put data
			var sampleCarpoolPutData = new Carpools({
				_id: '525cf20451979dea2c000001',
				name: 'New Carpool'
			});

			// Mock Carpool in scope
			scope.carpool = sampleCarpoolPutData;

			// Set PUT response
			$httpBackend.expectPUT(/carpools\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/carpools/' + sampleCarpoolPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid carpoolId and remove the Carpool from the scope', inject(function(Carpools) {
			// Create new Carpool object
			var sampleCarpool = new Carpools({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Carpools array and include the Carpool
			scope.carpools = [sampleCarpool];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/carpools\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleCarpool);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.carpools.length).toBe(0);
		}));
	});
}());