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
		var lastSpace;

		Bingo.getWords.then(function(data){
			vm.words = data;
		});

		vm.toggleSpace = function(word, index){
			if(Bingo.isCovered(index)){
				Bingo.uncover(word, index);
			}else{
				Bingo.cover(word, index);
				lastSpace = {word: word, index: index};
			}

			vm.hasBingo = Bingo.score();
		};

		vm.unBingo = function(){
			vm.hasBingo = false

			if(lastSpace){
				Bingo.uncover(lastSpace.word, lastSpace.index);
			}
		}

		vm.isCovered = Bingo.isCovered;
		vm.hasBingo = false;
	}]);
})();