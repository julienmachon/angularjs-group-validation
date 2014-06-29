myApp.directive('jmChildField', [function () {
    return {
        restrict: 'A',
        scope: {},
        require: ['^jmValidationGroup', '?ngModel'],
        link: function (scope, element, attrs, ctrl) {
            //Add reference to scope and ngModelCtrl to parent
            ctrl[0].addInput(scope, ctrl[1]);
        }
    };
}]);