angular.module('ngtweet-test').controller('MainCtrl', function($scope, $rootScope, $location) {
    $scope.currentView = '/';
    $rootScope.$on('$locationChangeStart', function(event) {
        $scope.currentView = $location.path();
    });
});
angular.module('ngtweet-test').controller('LoopCtrl', function($scope) {
    $scope.tweetIDs = ['690336422717476865', '693502507314737153', '692010796449136643', '692358963032125440'];

    $scope.timelineIDs = ['673710543212052480', '954767218012762121'];
    $scope.newTimelineIDs = ['576828964162965504', '539487832448843776'];
    $scope.selectedTweet = null;
    $scope.selectedTimeline  = null;
    $scope.selectedNewTimeline = null;

    $scope.selectTweet = function(tweetId) {
        console.log('Selected: ', tweetId);
        $scope.selectedTweet = tweetId;
    };

    $scope.selectTimeline = function(timelineId) {
        console.log('Selected: ', timelineId);
        $scope.selectedTimeline = timelineId;
    };

    $scope.selectNewTimeline = function(timelineId) {
        console.log('Selected: ', timelineId);
        $scope.selectedNewTimeline = timelineId;
    };
});
angular.module('ngtweet-test').controller('CallbackCtrl', function($scope, $window) {
    $scope.doneLoading = function doneLoading(id) {
        console.log('Done loading', id);
        $window.alert('Done loading tweet: ' + id);
    };
});
