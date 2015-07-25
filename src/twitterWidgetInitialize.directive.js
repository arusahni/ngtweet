(function() {
'use strict';

angular
    .module('ngtweet')
    .directive('twitterWidgetInitialize', TwitterWidgetInitialize);

function TwitterWidgetInitialize($log, TwitterWidgetFactory) {
    return {
        restrict: 'A',
        replace: false,
        scope: false,
        link: function(scope, element, attrs) {
            $log.debug('Initializing');
            TwitterWidgetFactory.initialize();
        }
    };
}
})();
