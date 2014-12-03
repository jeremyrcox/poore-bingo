'use strict';

// Declare app level module which depends on views, and components
angular.module('app', [
  'ngRoute',
  'restangular',
  'app.main',
  'angular-lodash'
  //'app.view2',
  //'app.version'
])
	.config(['$routeProvider', function($routeProvider) {
	  $routeProvider.otherwise({redirectTo: '/main'});
	}]);