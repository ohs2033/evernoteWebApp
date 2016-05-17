angular.module('shortly.links', [])

.controller('LinksController', function ($scope, Links, $location, Auth) {
	$scope.data = {};
	Links.getAll().then(function (data){
		console.log('url lists are ',data);
		$scope.data.links = data;
	})
});
