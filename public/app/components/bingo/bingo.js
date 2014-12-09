(function(){
	'use strict';

	angular.module('app')
		.factory('Bingo', ['Restangular', '_', function(Restangular, _){
			var covered = [];

			var cover = function(word, index){
				covered.push({space: index, word: word});
			};

			var uncover = function(word, index){
				covered.splice(_.findIndex(covered, {space: index}), 1);
			};

			var isCovered = function(index){
				return (_.findIndex(covered, {space: index}) >= 0);
			};

			var score = function(){
				var scoreCard = {
					c1: 0,
					c2: 0,
					c3: 0,
					c4: 0,
					c5: 0,
					r1: 0,
					r2: 0,
					r3: 0,
					r4: 0,
					r5: 0,
					tlToBr: 0,
					trToBl: 0
				};

				angular.forEach(covered, function(space){
					var index = space.space;
					var row = Math.floor(index/5) + 1;
					var column = index % 5 + 1;

					scoreCard['c' + column]++;
					scoreCard['r' + row]++;

					//diagonals;
					if(column == row){
						scoreCard.tlToBr++;
					}

					switch (column){
						case 1:
							if(row === 5){
								scoreCard.trToBl++;
							}
							break;
						case 2:
							if(row === 4){
								scoreCard.trToBl++;
							}
							break;
						case 3:
							if(row === 3){
								scoreCard.trToBl++;
							}
							break;
						case 4:
							if(row === 2){
								scoreCard.trToBl++;
							}
							break;
						case 5:
							if(row === 1){
								scoreCard.trToBl++;
							}
							break;
					}
				});


				var bingo = _.find(scoreCard, function(section){
					return (section === 5);
				});

				return !!bingo;
			};

			var getWords = Restangular.all('game').getList();

			return{
				getWords: getWords,
				cover: cover,
				uncover: uncover,
				isCovered: isCovered,
				score: score
			};
		}]);
})();