(function() {
'use strict';

angular
    .module('ngtweet')
    .factory('ngTweetLogger', ngTweetLogger);

function ngTweetLogger($log, logVerbose) {
    var noop = function() {};

    var verboseCall = function verboseCall(call) {
        if (logVerbose === true) {
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
