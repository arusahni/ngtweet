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

angular
    .module('ngtweet', [])
    .value('ngTweetLogVerbose', true)
    .value('twitterWidgetURL', 'https://platform.twitter.com/widgets.js');
})();

(function() {
'use strict';

ngTweetLogger.$inject = ["$log", "ngTweetLogVerbose"];
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

(function() {
'use strict';

TwitterTimeline.$inject = ["ngTweetLogger", "TwitterWidgetFactory"];
angular
    .module('ngtweet')
    .directive('twitterTimeline', TwitterTimeline);

function TwitterTimeline(ngTweetLogger, TwitterWidgetFactory) {
    function TimelineArgumentException(timelineType, message) {
        this.timelineType = timelineType;
        this.message = message;
    }

    function getTimelineArgs(scope) {
        var timelineArgs = {sourceType: scope.sourceType};
        if (['profile', 'likes'].indexOf(scope.sourceType) > -1) {
            if (scope.screenName) {
                timelineArgs.screenName = scope.screenName;
            } else if (scope.userId) {
                timelineArgs.userId = scope.userId;
            } else {
                throw new TimelineArgumentException(scope.sourceType, 'args: userId or screenName');
            }
        } else if (['collection', 'widget'].indexOf(scope.sourceType) > -1) {
            if (scope.id) {
                timelineArgs.id = scope.id;
            } else {
                throw new TimelineArgumentException(scope.sourceType, 'args: id');
            }
        } else if (scope.sourceType === 'list') {
            if (scope.id) {
                timelineArgs.id = scope.id;
            } else if (scope.ownerScreenName && scope.slug) {
                timelineArgs.ownerScreenName = scope.ownerScreenName;
                timelineArgs.slug = scope.slug;
            } else {
                throw new TimelineArgumentException(scope.sourceType, 'args: id or (ownerScreenName and slug)');
            }
        } else if (scope.sourceType === 'url') {
            if (scope.url) {
                timelineArgs.url = scope.url;
            } else {
                throw new TimelineArgumentException(scope.sourceType, 'args: url');
            }
        } else {
            throw new TimelineArgumentException(scope.sourceType, 'unknown type');
        }

        return timelineArgs;
    }

    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        scope: {
            id: '=?twitterTimelineId',
            screenName: '=?twitterTimelineScreenName',
            sourceType: '@?twitterTimelineType',
            userId: '=?twitterTimelineUserId',
            ownerScreenName: '=?twitterTimelineOwnerScreenName',
            slug: '=?twitterTimelineSlug',
            url: '=?twitterTimelineUrl'
        },
        template: '<div class="ngtweet-wrapper" ng-transclude></div>',
        link: function(scope, element, attrs) {
            ngTweetLogger.debug('Linking', scope, element, attrs);
            if (scope.id && !angular.isString(scope.id)) {
                ngTweetLogger.warn('twitterTimelineId should probably be a string due to loss of precision.');
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
            if (scope.sourceType) { //new style embed
                var timelineArgs;
                try {
                    timelineArgs = getTimelineArgs(scope);
                } catch (e) {
                    ngTweetLogger.error('Could not create new timeline: bad args for type "' +
                                        e.timelineType + '". Reason: ' + e.message);
                    return;
                }
                TwitterWidgetFactory.createTimelineNew(timelineArgs, element[0],
                                                       scope.twitterTimelineOptions).then(function success(embed) {
                    ngTweetLogger.debug('New Timeline Success!!!');
                }).catch(function creationError(message) {
                    ngTweetLogger.error('Could not create new timeline: ', message, element);
                });
            } else if (!angular.isUndefined(scope.id) || angular.isString(scope.screenName)) {
                TwitterWidgetFactory.createTimeline(scope.id, scope.screenName, element[0],
                                                    scope.twitterTimelineOptions).then(function success(embed) {
                    ngTweetLogger.debug('Timeline Success!!!');
                }).catch(function creationError(message) {
                    ngTweetLogger.error('Could not create timeline: ', message, element);
                });
            } else {
                TwitterWidgetFactory.load(element[0]);
            }
        }
    };
}
})();

(function() {
'use strict';

TwitterWidget.$inject = ["ngTweetLogger", "TwitterWidgetFactory"];
angular
    .module('ngtweet')
    .directive('twitterWidget', TwitterWidget);

function TwitterWidget(ngTweetLogger, TwitterWidgetFactory) {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        scope: {
            twitterWidgetId: '=',
            twitterWidgetOnRendered: '&',
            twitterWidgetOptions: '@'
        },
        template: '<div class="ngtweet-wrapper" ng-transclude></div>',
        link: function(scope, element, attrs) {
            scope.$watch('twitterWidgetId', function(newValue, oldValue) {
                ngTweetLogger.debug('Linking', element, attrs);
                var twitterWidgetOptions = scope.$eval(attrs.twitterWidgetOptions);
                if (oldValue !== undefined && newValue !== oldValue) { //replacing, clear node.
                    angular.element(element[0]).empty();
                }
                if (!angular.isUndefined(scope.twitterWidgetId)) {
                    if (!angular.isString(scope.twitterWidgetId)) {
                        ngTweetLogger.warn('twitterWidgetId should probably be a string due to loss of precision.');
                    }
                    TwitterWidgetFactory.createTweet(scope.twitterWidgetId, element[0], twitterWidgetOptions).then(function success(embed) {
                        ngTweetLogger.debug('Created tweet widget: ', scope.twitterWidgetId, element);
                        scope.twitterWidgetOnRendered();
                    }).catch(function creationError(message) {
                        ngTweetLogger.error('Could not create widget: ', message, element);
                    });
                } else {
                    TwitterWidgetFactory.load(element[0]);
                }
            });
        }
    };
}
})();

(function() {
'use strict';

TwitterWidgetFactory.$inject = ["$document", "$http", "ngTweetLogger", "twitterWidgetURL", "$q", "$window"];
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

    function loadScript() {
        if (!angular.isUndefined(deferred)) {
            return deferred.promise;
        }
        deferred = $q.defer();
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
        initialize: startScriptLoad,
        load: wrapElement
    };
}
})();

(function() {
'use strict';

TwitterWidgetInitialize.$inject = ["ngTweetLogger", "TwitterWidgetFactory"];
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
