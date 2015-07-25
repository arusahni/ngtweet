angular.module('ngtweet-test').controller('MainCtrl', function($scope, $rootScope, $location) {
    $scope.currentView = '/';

    $rootScope.$on('$locationChangeStart', function(event) {
        $scope.currentView = $location.path();
    });
});
angular.module('ngtweet-test').controller('HomeCtrl', function($scope) {
    $scope.name = 'World';
});
