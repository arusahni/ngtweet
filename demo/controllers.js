angular.module('ngtweet-test').controller('MainCtrl', function($scope, $rootScope, $location) {
    $scope.currentView = '/';

    $rootScope.$on('$locationChangeStart', function(event) {
        $scope.currentView = $location.path();
    });
});
angular.module('ngtweet-test').controller('LoopCtrl', function($scope) {
    $scope.tweetIDs = ['690336422717476865', '693502507314737153', '692010796449136643', '692358963032125440'];
});
