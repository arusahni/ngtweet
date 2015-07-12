(function() {
'use strict';

angular
    .module('ngtweet')
    .config(prodConfig);

function prodConfig($compileProvider, $logProvider) {
    $compileProvider.debugInfoEnabled(false);
    $logProvider.debugEnabled(false);
}
})();
