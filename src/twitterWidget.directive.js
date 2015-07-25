(function() {
'use strict';

angular
    .module('ngtweet')
    .directive('twitterWidget', TwitterWidget);

function TwitterWidget($log, TwitterWidgetFactory) {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        scope: {
            twitterWidgetId: '=',
            twitterWidgetOptions: '='
        },
        template: '<div class="ngtweet-wrapper" ng-transclude></div>',
        link: function(scope, element, attrs) {
            $log.debug('Linking', element, attrs);
            if (!angular.isUndefined(scope.twitterWidgetId)) {
                if (!angular.isString(scope.twitterWidgetId)) {
                    $log.warn('twitterWidgetId should probably be a string due to loss of precision.');
                }
                TwitterWidgetFactory.create(scope.twitterWidgetId, element[0], scope.twitterWidgetOptions).then(function success(embed) {
                    $log.debug('Success!!!');
                }).catch(function creationError(message) {
                    $log.error('Could not create widget: ', message, element);
                });
            } else {
                TwitterWidgetFactory.load(element[0]);
            }
        }
    };
}
})();
