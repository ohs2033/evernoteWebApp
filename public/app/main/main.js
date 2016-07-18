angular.module('evernote.notes', [])

.controller('NoteController', function ($scope, $location, $http) {
	$scope.data  = 'data';
	
	function reload () {
		$http({
				method: 'GET',
				url: '/rest/note/get'
			}).then(function (resp){
				$scope.phase1 = [];
				$scope.phase2 = [];
				$scope.phase3 = [];
				console.log(resp);
				for(var i =0; i<resp.data.length; i++){
					if(resp.data[i].phase==0){
						$scope.phase1.push(resp.data[i]);
					}else if(resp.data[i].phase==1){
						$scope.phase2.push(resp.data[i]);
					}else if(resp.data[i].phase==2){
						$scope.phase3.push(resp.data[i]);
					}

				}

			})
	}
	reload();

	$scope.onClick = function(guid) {
 		$scope.phase = ($scope.phase1).concat($scope.phase2).concat($scope.phase3);
 		console.log($scope.phase);
		for(var i =0; i<$scope.phase.length;i++){
			if($scope.phase[i].guid===guid){
				$scope.repeatingId = guid;
				$('#repeating').css({'visibility':''})
				$('#repeating #bodyRepeat').html(enml.HTMLOfENML($scope.phase[i].content,JSON.parse($scope.phase[i].resources)));
				$('#repeating h1').html($scope.phase[i].title);
				// $('#repeating').append('<div id ="finish" ng-click="finishFunc()"><h3>Finish</h3></div>')
				break;	
			}
			
		}

	}

	$scope.finishFunc = function() {
		console.log($scope.repeatingId);
		$("#repeating").css({'visibility':'hidden'});
		
		$http({
		  method: 'POST',
		  url: '/api/notes/finish',
		  data: {
		  	guid : $scope.repeatingId
		  }
		}).then(function(resp){
		  reload();
		})


	}

})

