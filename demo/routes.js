angular.module('ngtweet-test').config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'partials/home.html'
      }).
      when('/tweets', {
        templateUrl: 'partials/tweets.html'
      }).
      when('/ids', {
          templateUrl: 'partials/ids.html'
      }).
      when('/watching', {
          templateUrl: 'partials/watching.html',
          controller: 'LoopCtrl'
      }).
      when('/looped', {
          templateUrl: 'partials/looped.html',
          controller: 'LoopCtrl'
      }).
      when('/callbacks', {
          templateUrl: 'partials/callbacks.html',
          controller: 'CallbackCtrl'
      }).
      when('/timelines', {
          templateUrl: 'partials/timelines.html'
      }).
      when('/new-timelines', {
          templateUrl: 'partials/new-timelines.html'
      }).
      when('/lists', {
          templateUrl: 'partials/lists.html'
      }).
      when('/searches', {
          templateUrl: 'partials/searches.html'
      });
  }]);
