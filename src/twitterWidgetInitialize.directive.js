(function() {
'use strict';

angular
    .module('ngtweet')
    .directive('twitterWidgetInitialize', TwitterWidgetInitialize);

function TwitterWidgetInitialize(ngTweetLogger, TwitterWidgetFactory) {
    return {
        restrict: 'A',
        replace: false,
        scope: false,
        link: function(scope, element, attrs) {
            ngTweetLogger.debug('Initializing');
            TwitterWidgetFactory.initialize();
        }
    };
}
})();
