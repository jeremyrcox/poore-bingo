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

		//Words.game.getList().then(function(data){
		Bingo.getWords.then(function(data){
			vm.words = data;
		});

		vm.toggleSpace = function(word, index){
			if(isCovered(index)){
				covered.splice(covered.indexOf(index), 1);
			}else{
				covered.push(index);
			}
		};

		var isCovered = function(index){
			return (covered.indexOf(index) >=0);
		};

		vm.isCovered = isCovered;
	}]);
})();