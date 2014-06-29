myApp.service('Validator', [function () {

    /**
     *
     * Weight Validation
     *
     * Imperial weight validation. Check the min and max value set in scope
     * and compare them to (value of first input) + (value of second input / 14)
     * where input one is stones and input two pounds.
     *
     * Finally, set weightMin and weightMax validity on each of them.
     *
     * @param scope the scope of the validation group directive
     * @param inputs array of inputs and their scopes/modelController
     * @returns {boolean} Valid or not?
     */
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

        return (min && max);
    };

    /**
     * Height Validation
     *
     * Imperial height validation. Check the min and max value set in scope
     * and compare them to (value of first input) + (value of second input / 12)
     * where input one is feet and input two inches.
     *
     * Finally, set heightMin and heightMax validity on each of them.
     *
     * @param scope the scope of the validation group directive
     * @param inputs array of inputs and their scopes/modelController
     * @returns {boolean} Valid or not?
     */
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

        return (min && max);
    };

    /**
     * Date Validation
     *
     * Check the min and max date set in scope, build Date object with
     * (value of input 1) / (value of input 2) / (value of input 3)
     * where input one is Days, input two Months and input three Years.
     *
     * Finally, set dateMin and dateMax validity on each of them.
     *
     * @param scope the scope of the validation group directive
     * @param inputs array of inputs and their scopes/modelController
     * @returns {boolean} Valid or not?
     */
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

        return (min && max);
    };

    //ADD YOUR RULES...

}]);