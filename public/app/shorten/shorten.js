angular.module('shortly.shorten', [])

.controller('ShortenController', function ($scope, $location, Links, Auth) {
  $scope.link = {};
  var rValidUrl = /^(?!mailto:)(?:(?:https?|ftp):\/\/)?(?:\S+(?::\S*)?@)?(?:(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[0-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))|localhost)(?::\d{2,5})?(?:\/[^\s]*)?$/i;
  $scope.addLink = function() {
  	console.log('addLink.addone : ', $scope.link )
  	$('.spinnerContainer').html("<img class='spinner' src='../assets/spiffygif_46x46.gif'/>");
  	
  	Links.addOne($scope.link).then(function(res){
  		$('.spinnerContainer').html('');
  	})
  	// $location.path('/links');
  }

  $scope.validateUrl = function() {
  	console.log('checkValidate : ', $scope.link);
  	$scope.isValid = !!($scope.link.url).match(rValidUrl);
	if(!$scope.isValid) {
		$scope.warningWord = 'This url is not Valid';
	} else {
		$scope.warningWord = '';
	}
  	console.log('result of check : ', $scope.isValid)
  }


  	


});
