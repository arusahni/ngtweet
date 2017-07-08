(function() {
'use strict';

angular
    .module('ngtweet')
    .factory('TwitterWidgetFactory', TwitterWidgetFactory);

function TwitterWidgetFactory($document, $http, ngTweetLogger, twitterWidgetURL, $q, $window) {
    var deferred;
    var statusRe = /.*\/status\/(\d+)/;

    function startScriptLoad() {
        $window.twttr = (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0],
                t = $window.twttr || {};
            if (d.getElementById(id)) { return; }
            js = d.createElement(s);
            js.id = id;
            js.src = twitterWidgetURL;
            fjs.parentNode.insertBefore(js, fjs);

            t._e = [];
            t.ready = function(f) {
                t._e.push(f);
            };

            return t;
        }($document[0], 'script', 'twitter-wjs'));
    }

    function isScriptLoaded() {
        return $window.twttr && $window.twttr.init;
    }

    function loadScript() {
        if (!angular.isUndefined(deferred)) {
            return deferred.promise;
        }
        deferred = $q.defer();
        if (isScriptLoaded()) {
            return deferred.resolve($window.twttr);
        }

        startScriptLoad();
        $window.twttr.ready(function onLoadTwitterScript(twttr) {
            ngTweetLogger.debug('Twitter script ready');
            twttr.events.bind('rendered', onTweetRendered);
            deferred.resolve(twttr);
        });
        return deferred.promise;
    }

    function onTweetRendered(event) {
        ngTweetLogger.debug('Tweet rendered', event.target.parentElement.attributes);
    }

    function createTweet(id, element, options) {
        return loadScript().then(function success(twttr) {
            ngTweetLogger.debug('Creating Tweet', twttr, id, element, options);
            return $q.when(twttr.widgets.createTweet(id, element, options));
        });
    }

    function createTimeline(id, screenName, element, options) {
        return loadScript().then(function success(twttr) {
            ngTweetLogger.debug('Creating Timeline', id, screenName, options, element);
            if (angular.isString(screenName) && screenName.length > 0) {
                options['screenName'] = screenName;
            }
            return $q.when(twttr.widgets.createTimeline(id, element, options));
        });
    }

    function createTimelineNew(timelineArgs, element, options) {
        return loadScript().then(function success(twttr) {
            ngTweetLogger.debug('Creating new Timeline', timelineArgs, options, element);
            return $q.when(twttr.widgets.createTimeline(timelineArgs, element, options));
        });
    }

    function wrapElement(element) {
        loadScript().then(function success(twttr) {
            ngTweetLogger.debug('Wrapping', twttr, element);
            twttr.widgets.load(element);
        }).catch(function errorWrapping(message) {
            ngTweetLogger.error('Could not wrap element: ', message, element);
        });
    }

    return {
        createTweet: createTweet,
        createTimeline: createTimeline,
        createTimelineNew: createTimelineNew,
        initialize: loadScript,
        load: wrapElement
    };
}
})();
