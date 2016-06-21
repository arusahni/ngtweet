(function() {
'use strict';

angular
    .module('ngtweet')
    .directive('twitterWidget', TwitterWidget);

function TwitterWidget(ngTweetLogger, TwitterWidgetFactory) {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        scope: {
            twitterWidgetId: '=',
            twitterWidgetOnRendered: '&',
            twitterWidgetOptions: '@'
        },
        template: '<div class="ngtweet-wrapper" ng-transclude></div>',
        link: function(scope, element, attrs) {
            scope.$watch('twitterWidgetId', function(newValue, oldValue) {
                ngTweetLogger.debug('Linking', element, attrs);
                var twitterWidgetOptions = scope.$eval(attrs.twitterWidgetOptions);
                if (oldValue !== undefined && newValue !== oldValue) { //replacing, clear node.
                    angular.element(element[0]).empty();
                }
                if (!angular.isUndefined(scope.twitterWidgetId)) {
                    if (!angular.isString(scope.twitterWidgetId)) {
                        ngTweetLogger.warn('twitterWidgetId should probably be a string due to loss of precision.');
                    }
                    TwitterWidgetFactory.createTweet(scope.twitterWidgetId, element[0], twitterWidgetOptions).then(function success(embed) {
                        ngTweetLogger.debug('Created tweet widget: ', scope.twitterWidgetId, element);
                        scope.twitterWidgetOnRendered();
                    }).catch(function creationError(message) {
                        ngTweetLogger.error('Could not create widget: ', message, element);
                    });
                } else {
                    TwitterWidgetFactory.load(element[0]);
                }
            });
        }
    };
}
})();
