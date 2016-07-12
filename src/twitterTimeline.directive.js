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

    var rules = {
        profile: [['screenName'], ['userId']],
        likes: [['screenName'], ['userId']],
        collection: [['id']],
        widget: [['id']],
        list: [['id'], ['ownerScreenName', 'slug']],
        url: [['url']],
    };

    function getSourceRuleString(sourceRule) {
        function getRuleString(rule) {
            if (rule.length === 1) {
                return '"' + rule + '"';
            }
            return '("' + rule.join('" AND "') + '")';
        }

        return sourceRule.map(getRuleString).join(' OR ');
    }

    function getTimelineArgs(scope) {
        var timelineArgs = {sourceType: scope.sourceType};
        if (rules.hasOwnProperty(scope.sourceType)) {
            var sourceRules = rules[scope.sourceType];
            var valid = false;
            for (var i = 0, len = sourceRules.length; i < len; i++) {
                var rule = sourceRules[i];
                var params = {};
                for (var j = 0, ruleLen = rule.length; j < ruleLen; j++) {
                    if (scope[rule[j]]) {
                        params[rule[j]] = scope[rule[j]];
                    }
                }
                if (Object.keys(params).length === ruleLen) {
                    angular.merge(timelineArgs, params);
                    valid = true;
                    break;
                }
            }
            if (!valid) {
                throw new TimelineArgumentException(scope.sourceType, 'args: ' + getSourceRuleString(sourceRules));
            }
        } else {
            throw new TimelineArgumentException(scope.sourceType, 'unknown type');
        }

        return timelineArgs;
    }

    function link(scope, element, attrs) {
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
            TwitterWidgetFactory.createTimelineNew(timelineArgs, element[0], scope.twitterTimelineOptions)
                    .then(function success(embed) {
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
        link: link
    };
}
})();
