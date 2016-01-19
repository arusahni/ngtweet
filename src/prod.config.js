/**
 * Various production configuration settings.
 */
(function() {
'use strict';

angular
    .module('ngtweet')
    .config(prodConfig);

function prodConfig($compileProvider, $logProvider) {
    // Disabled because these are global - not local to the module. Will disable logging another way.
    // $compileProvider.debugInfoEnabled(false);
    // $logProvider.debugEnabled(false);
}
})();
