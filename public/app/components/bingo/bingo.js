(function(){
	'use strict';

	angular.module('app')
		.factory('Bingo', ['Restangular', function(Restangular){
			var getWords, cover, covered, score;

			covered = [];

			cover = function(word, index){
				covered.push({space: index, word: word});
			};

			score = function(){

			};

			getWords = Restangular.all('game').getList();

			return{
				getWords: getWords,
				cover: cover
			};
		}]);
})();