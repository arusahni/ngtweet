(function() {
'use strict';

angular.module('ngtweet', []);

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
        template: '<div class="ngtweet-wrapper" ng-transclude></div>',
        link: function(scope, element, attrs) {
            $log.debug('Linking', element, attrs);
            if (attrs.twitterWidgetId && attrs.twitterWidgetId !== '') {
                TwitterWidgetFactory.create(attrs.twitterWidgetId, element[0]).then(function success(embed) {
                    $log.debug('Success!!!');
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
        return loadScript().then(function success(twttr) {
            $log.debug('Wrapping', twttr, element);
            twttr.widgets.load(element);
        });
    }

    return {
        create: createTweet,
        load: wrapElement
    };
}
TwitterWidgetFactory.$inject = ["$document", "$http", "$log", "$q", "$window"];
})();
