(function() {
'use strict';

angular
    .module('ngtweet')
    .directive('twitterTimeline', TwitterTimeline);

function TwitterTimeline(ngTweetLogger, TwitterWidgetFactory) {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        scope: {
            twitterTimelineId: '=',
            twitterTimelineScreenName: '=?'
        },
        template: '<div class="ngtweet-wrapper" ng-transclude></div>',
        link: function(scope, element, attrs) {
            ngTweetLogger.debug('Linking', element, attrs);
            if (!angular.isString(scope.twitterTimelineId)) {
                ngTweetLogger.warn('twitterTimelineId should probably be a string due to loss of precision.');
            }
            try {
                scope.twitterTimelineOptions = JSON.parse(attrs.twitterTimelineOptions);
            } catch (e) {
                scope.$watch(function() {
                    return scope.$parent.$eval(attrs.twitterTimelineOptions);
                }, function(newValue, oldValue) {
                    scope.twitterTimelineOptions = newValue;
                });
            }
            if (angular.isUndefined(scope.twitterTimelineOptions)) {
                scope.twitterTimelineOptions = {};
            }
            if (!angular.isUndefined(scope.twitterTimelineId) || angular.isString(scope.twitterTimelineScreenName)) {
                TwitterWidgetFactory.createTimeline(scope.twitterTimelineId, scope.twitterTimelineScreenName, element[0], scope.twitterTimelineOptions).then(function success(embed) {
                    ngTweetLogger.debug('Timeline Success!!!');
                }).catch(function creationError(message) {
                    ngTweetLogger.error('Could not create timeline: ', message, element);
                });
            } else {
                TwitterWidgetFactory.load(element[0]);
            }
        }
    };
}
})();
