(function(){
	'use strict';

	angular.module('app.main', ['ngRoute'])

	.config(['$routeProvider', function($routeProvider) {
	  $routeProvider.when('/main', {
	    templateUrl: 'main/mainView.html',
	    controller: 'mainCtrl',
	    controllerAs: 'vm'
	  });
	}])

	.controller('mainCtrl', ['Bingo', '$log', function(Bingo, $log) {
		var vm=this;
		var covered = [];

		Bingo.getWords.then(function(data){
			vm.words = data;
		});

		vm.toggleSpace = function(word, index){
			if(Bingo.isCovered(index)){
				Bingo.uncover(word, index);
			}else{
				Bingo.cover(word, index);
			}

			console.log(Bingo.score());
		};

		vm.isCovered = Bingo.isCovered;
	}]);
})();