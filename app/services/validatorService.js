myApp.service('Validator', [function () {

    /**
     *
     **/
    this.validateWeight = function (scope, inputs) {
        function getWeight() {
            var stonesViewValue = inputs[0].controller.$viewValue || 0,
                poundsViewValue = inputs[1].controller.$viewValue || 0;

            return Number(stonesViewValue) + Number(poundsViewValue / 14);
        }

        var weight = getWeight();
        var min = weight >= scope.min;
        var max = weight <= scope.max;

        //get all inputs to validate
        for (var input in inputs) {
            inputs[input].controller.$setValidity('weightMin', min);
            inputs[input].controller.$setValidity('weightMax', max);
        }
    };

    /**
     * Height Validation
     **/
    this.validateHeight = function (scope, inputs) {
        function getHeight() {
            var feetViewValue = inputs[0].controller.$viewValue || 0,
                inchesViewValue = inputs[1].controller.$viewValue || 0;

            return Number(feetViewValue) + Number(inchesViewValue / 12);
        }

        var height = getHeight();
        var min = height >= scope.min;
        var max = height <= scope.max;

        //get all inputs to validate
        for (var input in inputs) {
            inputs[input].controller.$setValidity('heightMin', min);
            inputs[input].controller.$setValidity('heightMax', max);
        }
    };

    /**
     * Height Validation
     **/
    this.validateDate = function (scope, inputs) {
        function buildDate() {
            var date = new Date();
            date.setDate(inputs[0].controller.$viewValue || 0);
            date.setMonth(inputs[1].controller.$viewValue || 0);
            date.setYear(inputs[2].controller.$viewValue || 0);
            return date;
        }

        var minDate = new Date(scope.min),
            maxDate = new Date(scope.max),
            date = buildDate(),
            min = date >= minDate,
            max = date <= maxDate;

        //get all inputs to validate
        for (var input in inputs) {
            inputs[input].controller.$setValidity('dateMin', min);
            inputs[input].controller.$setValidity('dateMax', max);
        }
    };

}]);