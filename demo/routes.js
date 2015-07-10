angular.module('ngtweet-test').config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'partials/home.html',
        controller: 'HomeCtrl'
      }).
      when('/tweets', {
        templateUrl: 'partials/tweets.html'
      }).
      when('/ids', {
          templateUrl: 'partials/ids.html'
      });
  }]);
