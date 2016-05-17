angular.module('shortly.services', [])

.factory('Links', function ($http) {
  var getAll = function () {
    console.log('getall Started');
    return $http({
      method: 'GET',
      url: '/api/links'
    }).then(function (resp) {
      console.log('responded links are :', resp.data);
      return resp.data;
    })
  };
  var addOne = function (url) {
    console.log('addOne started',url);
    return $http({
      method: 'POST',
      url: '/api/links',
      data: url
    }).then(function(resp){
      return resp
    })
  };

 return {
    getAll: getAll,
    addOne: addOne
  };

})
.factory('Auth', function ($http, $location, $window) {

  var signin = function (user) {
    return $http({
      method: 'GET',
      url: '/api/users/signin',
    })
    .then(function (resp) {
      return resp.data.token;
    });
  };

  var signup = function (user) {
    return $http({
      method: 'GET',
      url: '/api/users/signup',
    })
    .then(function (resp) {
      return resp.data.token;
    });
  };

  var isAuth = function () {
    console.log('token is..', $window.localStorage.getItem('com.shortly'));
    return !!$window.localStorage.getItem('com.shortly');
  };

  var signout = function () {
    $window.localStorage.removeItem('com.shortly');
    $location.path('/signin');
  };


  return {
    signin: signin,
    signup: signup,
    isAuth: isAuth,
    signout: signout
  };
});
