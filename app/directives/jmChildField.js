myApp.directive('jmChildField', [function () {
    return {
        restrict: 'A',
        scope: {},
        require: ['^jmValidationGroup', '?ngModel'],
        link: function (scope, element, attrs, ctrl) {
            ctrl[0].addInput(scope, ctrl[1]);
        }
    };
}]);