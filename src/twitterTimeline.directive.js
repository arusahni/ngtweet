(function() {
'use strict';

angular
    .module('ngtweet')
    .directive('twitterTimeline', TwitterTimeline);

function TwitterTimeline($log, TwitterWidgetFactory) {
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
            $log.debug('Linking', element, attrs);
            if (!angular.isString(scope.twitterTimelineId)) {
                $log.warn('twitterTimelineId should probably be a string due to loss of precision.');
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
                    $log.debug('Timeline Success!!!');
                }).catch(function creationError(message) {
                    $log.error('Could not create timeline: ', message, element);
                });
            } else {
                TwitterWidgetFactory.load(element[0]);
            }
        }
    };
}
})();
