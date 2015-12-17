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
!function(){"use strict";angular.module("ngtweet",[])}(),function(){"use strict";function e(e,t){return{restrict:"E",replace:!0,transclude:!0,scope:{twitterTimelineId:"=",twitterTimelineScreenName:"=?"},template:'<div class="ngtweet-wrapper" ng-transclude></div>',link:function(i,n,r){e.debug("Linking",n,r),angular.isString(i.twitterTimelineId)||e.warn("twitterTimelineId should probably be a string due to loss of precision.");try{i.twitterTimelineOptions=JSON.parse(r.twitterTimelineOptions)}catch(c){i.$watch(function(){return i.$parent.$eval(r.twitterTimelineOptions)},function(e,t){i.twitterTimelineOptions=e})}angular.isUndefined(i.twitterTimelineOptions)&&(i.twitterTimelineOptions={}),!angular.isUndefined(i.twitterTimelineId)||angular.isString(i.twitterTimelineScreenName)?t.createTimeline(i.twitterTimelineId,i.twitterTimelineScreenName,n[0],i.twitterTimelineOptions).then(function(t){e.debug("Timeline Success!!!")})["catch"](function(t){e.error("Could not create timeline: ",t,n)}):t.load(n[0])}}}angular.module("ngtweet").directive("twitterTimeline",e),e.$inject=["$log","TwitterWidgetFactory"]}(),function(){"use strict";function e(e,t){return{restrict:"E",replace:!0,transclude:!0,scope:{twitterWidgetId:"=",twitterWidgetOptions:"="},template:'<div class="ngtweet-wrapper" ng-transclude></div>',link:function(i,n,r){e.debug("Linking",n,r),angular.isUndefined(i.twitterWidgetId)?t.load(n[0]):(angular.isString(i.twitterWidgetId)||e.warn("twitterWidgetId should probably be a string due to loss of precision."),t.createTweet(i.twitterWidgetId,n[0],i.twitterWidgetOptions).then(function(t){e.debug("Success!!!")})["catch"](function(t){e.error("Could not create widget: ",t,n)}))}}}angular.module("ngtweet").directive("twitterWidget",e),e.$inject=["$log","TwitterWidgetFactory"]}(),function(){"use strict";function e(e,t,i,n,r){function c(){r.twttr=function(e,t,i){var n,c=e.getElementsByTagName(t)[0],o=r.twttr||{};if(!e.getElementById(i))return n=e.createElement(t),n.id=i,n.src="//platform.twitter.com/widgets.js",c.parentNode.insertBefore(n,c),o._e=[],o.ready=function(e){o._e.push(e)},o}(e[0],"script","twitter-wjs")}function o(){return angular.isUndefined(g)?(g=n.defer(),c(),r.twttr.ready(function(e){i.debug("Twitter script ready"),e.events.bind("rendered",a),g.resolve(e)}),g.promise):g.promise}function a(e){i.debug("Tweet rendered",e.target.parentElement.attributes)}function u(e,t,r){return o().then(function(c){return i.debug("Creating Tweet",c,e,t,r),n.when(c.widgets.createTweet(e,t,r))})}function d(e,t,r,c){return o().then(function(o){return i.debug("Creating Timeline",e,t,c,r),angular.isString(t)&&t.length>0&&(c.screenName=t),n.when(o.widgets.createTimeline(e,r,c))})}function l(e){o().then(function(t){i.debug("Wrapping",t,e),t.widgets.load(e)})["catch"](function(t){i.error("Could not wrap element: ",t,e)})}var g;return{createTweet:u,createTimeline:d,initialize:c,load:l}}angular.module("ngtweet").factory("TwitterWidgetFactory",e),e.$inject=["$document","$http","$log","$q","$window"]}(),function(){"use strict";function e(e,t){return{restrict:"A",replace:!1,scope:!1,link:function(i,n,r){e.debug("Initializing"),t.initialize()}}}angular.module("ngtweet").directive("twitterWidgetInitialize",e),e.$inject=["$log","TwitterWidgetFactory"]}(),function(){"use strict";function e(e,t){e.debugInfoEnabled(!1),t.debugEnabled(!1)}angular.module("ngtweet").config(e),e.$inject=["$compileProvider","$logProvider"]}();