(function() {
'use strict';

angular
    .module('ngtweet')
    .factory('ngTweetLogger', ngTweetLogger);

function ngTweetLogger($log, ngTweetLogVerbose) {
    var noop = function() {};

    var verboseCall = function verboseCall(call) {
        if (ngTweetLogVerbose === true) {
            return call;
        }
        return noop;
    };

    return {
        'log': verboseCall($log.log),
        'debug': verboseCall($log.debug),
        'info': verboseCall($log.info),
        'warn': $log.warn,
        'error': $log.error
    };
}
})();
