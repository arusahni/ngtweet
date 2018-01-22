(function() {
'use strict';

angular
    .module('ngtweet')
    .directive('twitterTimeline', TwitterTimeline);

function TwitterTimeline(ngTweetLogger, TwitterWidgetFactory) {
    /**
     * An error
     */
    function TimelineArgumentException(timelineType, message) {
        this.timelineType = timelineType;
        this.message = message;
    }

    var scopeParamsMap = {
        id: '=?twitterTimelineId',
        screenName: '=?twitterTimelineScreenName',
        sourceType: '@?twitterTimelineType',
        userId: '=?twitterTimelineUserId',
        ownerScreenName: '=?twitterTimelineOwnerScreenName',
        slug: '=?twitterTimelineSlug',
        url: '=?twitterTimelineUrl',
    };

    // Convert the scope params to a collection of bound args
    var scopeParams = Object.keys(scopeParamsMap).reduce(function(acc, keyName) {
        if (scopeParamsMap[keyName][0] === '=') { // if two-way bound
            acc.push(keyName);
        }
        return acc;
    }, []);

    // Rules for the given parameter
    var rules = {
        profile: [['screenName'], ['userId']],
        likes: [['screenName'], ['userId']],
        collection: [['id']],
        widget: [['id']],
        list: [['id'], ['ownerScreenName', 'slug']],
        url: [['url']],
    };

    /**
     * Diff two arrays.
     * @param {Array} arr1 - The first array
     * @param {Array} arr2 - The second array
     * @return {boolean} true if the arrays are different, false otherwise
     */
    function diffArrays(arr1, arr2) {
        if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
            return true;
        }
        if (arr1.length !== arr2.length) {
            return true;
        }
        for (var i = 0, len = arr1.length; i < len; i++) {
            if (arr1[i] !== arr2[i]) {
                return true;
            }
        }
        return false;
    }

    /**
     * Turn the rules for a sourceType into a human-readable string
     * @param {string[][]} sourceRule - The sourceType rules
     * @return {string} the readable rules
     */
    function getSourceRuleString(sourceRule) {
        function getRuleString(rule) {
            if (rule.length === 1) {
                return '"' + rule + '"';
            }
            return '("' + rule.join('" AND "') + '")';
        }

        return sourceRule.map(getRuleString).join(' OR ');
    }

    /**
     * Get the arguments for the timeline based on parameter rules
     * @param {Object} scope - The directive scope
     * @return {Object} Key-Value arg object
     */
    function getTimelineArgs(scope) {
        var timelineArgs = {sourceType: scope.sourceType};
        // if this is a valid sourceType...
        if (rules.hasOwnProperty(scope.sourceType)) {
            var sourceRules = rules[scope.sourceType];
            var valid = false;
            // Loop over the required args for the source
            for (var i = 0, len = sourceRules.length; i < len; i++) {
                var rule = sourceRules[i];
                var params = {};
                for (var j = 0, ruleLen = rule.length; j < ruleLen; j++) {
                    if (angular.isDefined(scope[rule[j]])) { // if the rule is present, add it to the params collection
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
        if (scope.sourceType) { // new style embed
            scope.$watchGroup(scopeParams, function(newValue, oldValue) {
                if (diffArrays(oldValue, newValue)) { //replacing, clear node
                    angular.element(element[0]).empty();
                }
                if (newValue.every(function isEmpty(arg) { return !arg; })) {
                    ngTweetLogger.debug('Falsey args received. Not rendering the timeline.');
                    return;
                }
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
                    ngTweetLogger.debug('New Timeline Success!');
                }).catch(function creationError(message) {
                    ngTweetLogger.error('Could not create new timeline: ', message, element);
                });
            });
        } else if (angular.isDefined(scope.id) || angular.isString(scope.screenName)) { // old style
            scope.$watch('id', function(newValue, oldValue) {
                if (scope.id === null) {
                    return;
                }
                if (oldValue !== undefined && newValue !== oldValue) {
                    angular.element(element[0]).empty();
                }
                TwitterWidgetFactory.createTimeline(scope.id, scope.screenName, element[0],
                        scope.twitterTimelineOptions).then(function success(embed) {
                    ngTweetLogger.debug('Timeline Success!!!');
                }).catch(function creationError(message) {
                            ngTweetLogger.error('Could not create timeline: ', message, element);
                        });
            });
        } else {
            TwitterWidgetFactory.load(element[0]);
        }
    }

    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        scope: scopeParamsMap,
        template: '<div class="ngtweet-wrapper" ng-transclude></div>',
        link: link
    };
}
})();
