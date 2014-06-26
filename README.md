angularjs-group-validation
==========================

## What is this?

One validation rule for multiple fields.

I came across that issue a few times working on forms with angular: 2 inputs or more, one validation rule.

The classic one is with imperial units (I hate them, they make my life so hard). 2 fields, feet and inches, 1 rule: max height 8 feet.

//TODO explain dev process

Another one is with dates.I worked on a project users were able to contract a legacy insurance. In order to apply, you have to be a certain age. These min and max date were supplied by a service and I had to use them to validate the user entry. But! I was given 3 inputs, day, month and year (that's what the design said), which means that, as well as validating each individual field, I had to build the date and test it against the min and max from the system

//TODO explain dev process

Sort code

//TODO explain sort code

## How does it work?

//TODO explain approach 
```html
<div directive-parent=""> 
    <input name="feet" ng-model="feet" directive-child=""/>
    <input name="inches" ng-model="inches" directive-child=""/>
</div>
```

//TODO insert diagram

## Try it

http://jsfiddle.net/julienmachon/y3k4m/