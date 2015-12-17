/**
 * ngTweet - Angular directives for better Twitter integration.
 *
 * @license
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Aru Sahni, http://arusahni.net
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */
(function() {
'use strict';

angular.module('ngtweet', []);

})();

(function() {
'use strict';

angular
    .module('ngtweet')
    .directive('twitterTimeline', TwitterTimeline);

function TwitterTimeline($log, TwitterWidgetFactory) {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        scope: {
            twitterTimelineId: '=',
            twitterTimelineScreenName: '=?'
        },
        template: '<div class="ngtweet-wrapper" ng-transclude></div>',
        link: function(scope, element, attrs) {
            $log.debug('Linking', element, attrs);
            if (!angular.isString(scope.twitterTimelineId)) {
                $log.warn('twitterTimelineId should probably be a string due to loss of precision.');
            }
            try {
                scope.twitterTimelineOptions = JSON.parse(attrs.twitterTimelineOptions);
            } catch (e) {
                scope.$watch(function() {
                    return scope.$parent.$eval(attrs.twitterTimelineOptions);
                }, function(newValue, oldValue) {
                    scope.twitterTimelineOptions = newValue;
                });
            }
            if (angular.isUndefined(scope.twitterTimelineOptions)) {
                scope.twitterTimelineOptions = {};
            }
            if (!angular.isUndefined(scope.twitterTimelineId) || angular.isString(scope.twitterTimelineScreenName)) {
                TwitterWidgetFactory.createTimeline(scope.twitterTimelineId, scope.twitterTimelineScreenName, element[0], scope.twitterTimelineOptions).then(function success(embed) {
                    $log.debug('Timeline Success!!!');
                }).catch(function creationError(message) {
                    $log.error('Could not create timeline: ', message, element);
                });
            } else {
                TwitterWidgetFactory.load(element[0]);
            }
        }
    };
}
TwitterTimeline.$inject = ["$log", "TwitterWidgetFactory"];
})();

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
                TwitterWidgetFactory.createTweet(scope.twitterWidgetId, element[0], scope.twitterWidgetOptions).then(function success(embed) {
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
TwitterWidget.$inject = ["$log", "TwitterWidgetFactory"];
})();

(function() {
'use strict';

angular
    .module('ngtweet')
    .factory('TwitterWidgetFactory', TwitterWidgetFactory);

function TwitterWidgetFactory($document, $http, $log, $q, $window) {
    var deferred;
    var statusRe = /.*\/status\/(\d+)/;

    function startScriptLoad() {
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
    }

    function loadScript() {
        if (!angular.isUndefined(deferred)) {
            return deferred.promise;
        }
        deferred = $q.defer();
        startScriptLoad();
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

    function createTweet(id, element, options) {
        return loadScript().then(function success(twttr) {
            $log.debug('Creating Tweet', twttr, id, element, options);
            return $q.when(twttr.widgets.createTweet(id, element, options));
        });
    }

    function createTimeline(id, screenName, element, options) {
        return loadScript().then(function success(twttr) {
            $log.debug('Creating Timeline', id, screenName, options, element);
            if (angular.isString(screenName) && screenName.length > 0) {
                options['screenName'] = screenName;
            }
            return $q.when(twttr.widgets.createTimeline(id, element, options));
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
        createTweet: createTweet,
        createTimeline: createTimeline,
        initialize: startScriptLoad,
        load: wrapElement
    };
}
TwitterWidgetFactory.$inject = ["$document", "$http", "$log", "$q", "$window"];
})();

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
TwitterWidgetInitialize.$inject = ["$log", "TwitterWidgetFactory"];
})();
