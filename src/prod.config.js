/**
 * Various production configuration settings.
 */
(function() {
'use strict';

angular
    .module('ngtweet')
    .config(prodConfig);

function prodConfig($provide) {
    $provide.decorator('ngTweetLogVerbose', function($delegate) {
        return false;
    });
}
})();
