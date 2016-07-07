(function() {
'use strict';

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
