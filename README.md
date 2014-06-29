angularjs-group-validation
==========================

## What is this?

I came across that issue a few times working on forms with angular: 2 inputs or more, one validation rule.

The classic one is with imperial units (I hate them, they make my life so hard). 2 fields, feet and inches, 1 rule: max and min (between 2 feet and 8 feet for example).

I need to validate each individual inputs and also combined them and and check the result. For example, let's say I want to accept a result between 2 feet and 8 feet. Here is a result table of what I expect:

| Feet | Inches | Valid? | Reason
-----------------------------------------------------------------------
| 2    | 3      | true   | valid feet, valid inches, under 8 and over 2
-----------------------------------------------------------------------
| 2    | 12     | true   | valid feet, valid inches, under 8 and over 2
-----------------------------------------------------------------------
| 2    | 20     | false  | invalid inches (max 12)
-----------------------------------------------------------------------
| 8    | 10     | false  | over 8
-----------------------------------------------------------------------
| ee   | 10     | false  | invalid feet
-----------------------------------------------------------------------
| 7    | 12     | true   | valid feet, valid inches, under 8 and over 2
-----------------------------------------------------------------------

Using the basic angular validation, it is easy to validate Feet and Inches. 

```html
<input name="feet" type="number" min="2" max="8" data-ng-model="feet" />
<input name="inches" type="number" min="0" max="12" data-ng-model="feet" />
```
The problem is, I can't validate the overall rule, which is the combination of these 2 inputs

Same issue with dates. I worked on a project developing a form to contract an insurance. In order to apply, you have to be a certain age. These min and max date were supplied by a backend service and I had to use them to validate the user entry. But! I was given 3 inputs by the razor .Net template, day, month and year, which means that as well as validating each individual field, I had to build the date and test it against the min and max from the system.

So, I have 3 inputs

```html
<input name="day" type="number" min="1" max="31" data-ng-model="day" />
<input name="month" type="number" min="1" max="12" data-ng-model="month" />
<input name="year" type="number" min="1970" max="2020" data-ng-model="year" />
```

But if I want the date to be between 12/03/1987 and 14/07/2009, I need to combined those 3 inputs.


## How does it work?

The key thing here is that we want to combined inputs results. So we want a parent to control children elements. A way to do this with angular is to have a child directive within a parent directive.  

//TODO explain approach 
```html
<div parent=""> 
    <input name="feet" ng-model="feet" child=""/>
    <input name="inches" ng-model="inches" child=""/>
</div>
```

And the directives look like this

```javascript
//Parent directive
myApp.directive('parent', function () {
    return {
        restrict: 'A',
        controller: function ($scope) {
        },
        link: function(scope, element, attrs) {
        }
    };
});
//Child directive
myApp.directive('child', function () {
    return {
        restrict: 'A',
        scope: {},
        controller: function ($scope) {
        },
        link: function(scope, element, attrs) {
        }
    };
});
```
In the link function of the child, we have access to the parent controller. Anything we expose on this controller can be called by the child directive. This is perfect, because we want the parent to be aware of all the children, we can just get each child to add a reference to themselves in an object stored in parent.

The other thing here, we also have access to the model controller in the child directive. If we give that to the parent, we will then be able to control the model of all the children. Let's do it:

```javascript
//Parent directive
myApp.directive('parent', function () {
    return {
        restrict: 'A',
        controller: function ($scope) {
            var inputs = []
            //Expose function for child
            this.addInput = function(scope, ngModelCtrl) {
                //add reference to inputs object
                inputs.push({
                    name: ctrl.$name,
                    scope: scope,
                    controller: ctrl
                });
            }
        }
    };
});
//Child directive
myApp.directive('child', function () {
    return {
        restrict: 'A',
        scope: {},
        require: '[^parent', ngModel],
        link: function (scope, element, attrs, ctrl) {
            //Add reference to scope and ngModelCtrl to parent
            ctrl[0].addInput(scope, ctrl[1]);
        }
    };
});
```

Good! So now, we have the scope and the model controller reference of all our inputs in parent. All in one place. Now we have to come up with a way to combine the value of all inputs, compare it to our min and max and set the validity properly.

We are going to add our function in the $parser array on the model controller of each inputs. Every time one of the child is updated, the function will run.

```javascript
//Parent directive
myApp.directive('parent', function () {
    return {
        restrict: 'A',
        controller: function ($scope) {
            var inputs = []
            //Expose function for child
            this.addInput = function(scope, ngModelCtrl) {
                //add reference to inputs object
                inputs.push({
                    name: ctrl.$name,
                    scope: scope,
                    controller: ctrl
                });
                //runs every time model is updated
                ctrl.$parsers.push(function (value) {
                    //DO validation stuff here
                });
            }
        }
    };
});
```

We have pretty much everything we need now. Let's implement the height validator

```javascript
//Parent directive
myApp.directive('parent', function () {
    return {
        restrict: 'A',
        controller: function ($scope) {
            //list of inputs
            var inputs = []
            //internal function, add feet and inches, convert and return result
            function getHeight() {
                var feetViewValue = inputs[0].controller.$viewValue || 0,
                    inchesViewValue = inputs[1].controller.$viewValue || 0;
                return Number(feetViewValue) + Number(inchesViewValue / 12);
            }
            //Expose function for child
            this.addInput = function(scope, ngModelCtrl) {
                $scope.min = 2;
                $scope.max = 8;
                //add reference to inputs object
                inputs.push({
                    name: ctrl.$name,
                    scope: scope,
                    controller: ctrl
                });
                //runs every time model is updated
                ctrl.$parsers.push(function (value) {
                    //get height
                    var height = getHeight();
                    //check mon
                    var min = weight >= scope.min;
                    //check max
                    var max = weight <= scope.max;
                    //get all inputs to validate
                    for (var input in inputs) {
                        //set validity
                        inputs[input].controller.$setValidity('heightMin', min);
                        inputs[input].controller.$setValidity('heightMax', max);
                    }
                    //valid value in scope
                    $scope.valid = (min && max);
                });
            }
        }
    };
});
```

That's is! Now we combined the two inputs together and set their validity using a single rule (or 2, min and max). This is brilliant. One little big thing though, if I write a directive for a date combined validation, I will realise how similar it will look with that one. In fact, they are identical apart from the validation function. So the last thing I want to do, is to make it more generic and sexy. 

Because the only thing that changes is the validating function, I am going to include a service in the parent directive that will supply the validation function. I am also going to add a value in the directive attribute which will be the name of the function to call. Finally, I also add a attribute `scope` which will contain an object of all the keys and values to add in the parent scope.

```html
<div parent="validateHeight" scope="{'min': '2', 'max': '8'}"> 
    <input name="feet" ng-model="feet" child=""/>
    <input name="inches" ng-model="inches" child=""/>
</div>
```

And the JavaScript

```javascript
//The validator service
myApp.service('Validator', function () {
    //Validation function
    this.validateHeight = function() {
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
    }
});
//the new parent directive
myApp.directive('parent', function (Validator) {
    return {
        restrict: 'A',
        scope: {
            obj: '@scope',
            validate: '@parent'
        },
        controller: function ($scope) {
            //list of inputs
            var inputs = [];
            //init scope with object
            angular.forEach($scope.$eval('('+$scope.obj+')'), function(val, key) {
                $scope[key] = val;
            });
            //Expose function for child
            this.addInput = function(scope, ngModelCtrl) {
                //add reference to inputs object
                inputs.push({
                    name: ctrl.$name,
                    scope: scope,
                    controller: ctrl
                });
                //runs every time model is updated
                ctrl.$parsers.push(function (value) {
                    $scope.valid = Validator[$scope.validate]($scope, inputs);
                });
            }
        }
    };
});
```
Et voilà! Now the only thing you have to do is add your validating functions in the `Validator` service.

Let's do the date example:

```html
<div parent="validateDate" data-scope="{'min': '12/03/1987', 'max': '14/07/2009'}"> 
    <input name="day" ng-model="day" min="1" max="31" child=""/>
    <input name="month" ng-model="month" min="1" max="12" child=""/>
    <input name="year" ng-model="year" min="1987" max="2009" child=""/>
</div>
```

The new validating function:

```javascript
//The validator service
myApp.service('Validator', function () {
    //Validation function
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
});
```

That's it!

## Try it

http://jsfiddle.net/julienmachon/y3k4m/