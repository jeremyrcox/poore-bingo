(function(){
	'use strict';

	angular.module('app').controller('TopBarCtrl', function ($scope, $window) {
		$scope.challenge = function(){
			$window.alert("Sorry, this feature isn't ready yet.")
		}

		$scope.suggestWords = function(){
			$window.alert("Sorry, this feature isn't ready yet.")
		}
	});

})();