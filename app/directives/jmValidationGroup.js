myApp.directive('jmValidationGroup', [function () {
    return {
        restrict: 'A',
        scope: {
            obj: '@scope',
            validate: '@jmValidationGroup'
        },
        require: '?ngModel',
        controller: ['$scope', 'Validator', function ($scope, Validator) {
            //init scope with object
            angular.forEach($scope.$eval('('+$scope.obj+')'), function(val, key) {
                $scope[key] = val;
            });
            //Array of inputs with a ref on their model controller
            var inputs = [];

            this.addInput = function (scope, ctrl) {
                //add reference to inputs object
                inputs.push({
                    name: ctrl.$name,
                    scope: scope,
                    controller: ctrl
                });
                //runs every time model is updated
                ctrl.$parsers.push(function (value) {
                    //Calls validator from service
                    Validator[$scope.validate]($scope, inputs);
                    return value;
                });
                //runs when init
                //TODO
            };
        }]
    };
}]);