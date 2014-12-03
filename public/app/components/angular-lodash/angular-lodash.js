'use strict';

angular.module('angular-lodash',[])
  .factory('_', function ($window) {
    return $window._;
  });