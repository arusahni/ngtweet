(function() {
'use strict';

angular
    .module('ngtweet')
    .factory('TwitterWidgetFactory', TwitterWidgetFactory);

function TwitterWidgetFactory($document, $http, $log, $q, $window) {
    var deferred;
    var statusRe = /.*\/status\/(\d+)/;

    $window.twttr = (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0],
        t = $window.twttr || {};
      if (d.getElementById(id)) { return; }
      js = d.createElement(s);
      js.id = id;
      js.src = '//platform.twitter.com/widgets.js';
      fjs.parentNode.insertBefore(js, fjs);

      t._e = [];
      t.ready = function(f) {
        t._e.push(f);
      };

      return t;
    }($document[0], 'script', 'twitter-wjs'));

    function loadScript() {
        if (!angular.isUndefined(deferred)) {
            return deferred.promise;
        }
        deferred = $q.defer();
        $window.twttr.ready(function onLoadTwitterScript(twttr) {
            $log.debug('Twitter script ready');
            twttr.events.bind('rendered', onTweetRendered);
            deferred.resolve(twttr);
        });
        return deferred.promise;
    }

    function onTweetRendered(event) {
        $log.debug('Tweet rendered', event.target.parentElement.attributes);
    }

    function createTweet(id, element) {
        return loadScript().then(function success(twttr) {
            $log.debug('Creating', twttr, id, element);
            return $q.when(twttr.widgets.createTweet(id, element));
        });
    }

    function wrapElement(element) {
        loadScript().then(function success(twttr) {
            $log.debug('Wrapping', twttr, element);
            twttr.widgets.load(element);
        }).catch(function errorWrapping(message) {
            $log.error('Could not wrap element: ', message, element);
        });
    }

    return {
        create: createTweet,
        load: wrapElement
    };
}
})();
