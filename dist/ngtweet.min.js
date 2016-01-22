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
!function(){"use strict";angular.module("ngtweet",[]).value("logVerbose",!0)}(),function(){"use strict";function e(e,t){var n=function(){},i=function(e){return t===!0?e:n};return{log:i(e.log),debug:i(e.debug),info:i(e.info),warn:e.warn,error:e.error}}e.$inject=["$log","logVerbose"],angular.module("ngtweet").factory("ngTweetLogger",e)}(),function(){"use strict";function e(e,t){return{restrict:"E",replace:!0,transclude:!0,scope:{twitterTimelineId:"=",twitterTimelineScreenName:"=?"},template:'<div class="ngtweet-wrapper" ng-transclude></div>',link:function(n,i,r){e.debug("Linking",i,r),angular.isString(n.twitterTimelineId)||e.warn("twitterTimelineId should probably be a string due to loss of precision.");try{n.twitterTimelineOptions=JSON.parse(r.twitterTimelineOptions)}catch(o){n.$watch(function(){return n.$parent.$eval(r.twitterTimelineOptions)},function(e,t){n.twitterTimelineOptions=e})}angular.isUndefined(n.twitterTimelineOptions)&&(n.twitterTimelineOptions={}),!angular.isUndefined(n.twitterTimelineId)||angular.isString(n.twitterTimelineScreenName)?t.createTimeline(n.twitterTimelineId,n.twitterTimelineScreenName,i[0],n.twitterTimelineOptions).then(function(t){e.debug("Timeline Success!!!")})["catch"](function(t){e.error("Could not create timeline: ",t,i)}):t.load(i[0])}}}e.$inject=["ngTweetLogger","TwitterWidgetFactory"],angular.module("ngtweet").directive("twitterTimeline",e)}(),function(){"use strict";function e(e,t){return{restrict:"E",replace:!0,transclude:!0,scope:{twitterWidgetId:"=",twitterWidgetOptions:"="},template:'<div class="ngtweet-wrapper" ng-transclude></div>',link:function(n,i,r){e.debug("Linking",i,r),angular.isUndefined(n.twitterWidgetId)?t.load(i[0]):(angular.isString(n.twitterWidgetId)||e.warn("twitterWidgetId should probably be a string due to loss of precision."),t.createTweet(n.twitterWidgetId,i[0],n.twitterWidgetOptions).then(function(t){e.debug("Success!!!")})["catch"](function(t){e.error("Could not create widget: ",t,i)}))}}}e.$inject=["ngTweetLogger","TwitterWidgetFactory"],angular.module("ngtweet").directive("twitterWidget",e)}(),function(){"use strict";function e(e,t,n,i,r){function o(){r.twttr=function(e,t,n){var i,o=e.getElementsByTagName(t)[0],c=r.twttr||{};if(!e.getElementById(n))return i=e.createElement(t),i.id=n,i.src="//platform.twitter.com/widgets.js",o.parentNode.insertBefore(i,o),c._e=[],c.ready=function(e){c._e.push(e)},c}(e[0],"script","twitter-wjs")}function c(){return angular.isUndefined(l)?(l=i.defer(),o(),r.twttr.ready(function(e){n.debug("Twitter script ready"),e.events.bind("rendered",u),l.resolve(e)}),l.promise):l.promise}function u(e){n.debug("Tweet rendered",e.target.parentElement.attributes)}function a(e,t,r){return c().then(function(o){return n.debug("Creating Tweet",o,e,t,r),i.when(o.widgets.createTweet(e,t,r))})}function g(e,t,r,o){return c().then(function(c){return n.debug("Creating Timeline",e,t,o,r),angular.isString(t)&&t.length>0&&(o.screenName=t),i.when(c.widgets.createTimeline(e,r,o))})}function d(e){c().then(function(t){n.debug("Wrapping",t,e),t.widgets.load(e)})["catch"](function(t){n.error("Could not wrap element: ",t,e)})}var l;return{createTweet:a,createTimeline:g,initialize:o,load:d}}e.$inject=["$document","$http","ngTweetLogger","$q","$window"],angular.module("ngtweet").factory("TwitterWidgetFactory",e)}(),function(){"use strict";function e(e,t){return{restrict:"A",replace:!1,scope:!1,link:function(n,i,r){e.debug("Initializing"),t.initialize()}}}e.$inject=["ngTweetLogger","TwitterWidgetFactory"],angular.module("ngtweet").directive("twitterWidgetInitialize",e)}(),function(){"use strict";function e(e){e.decorator("logVerbose",["$delegate",function(e){return!1}])}e.$inject=["$provide"],angular.module("ngtweet").config(e)}();