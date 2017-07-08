## 0.6.2

### Fixes
* Fixed issue where ngTweet would fail to load if the Twitter widget library
  had already been loaded by another library. (@sujameslin)

## 0.6.1

### Fixes
* Fixed race condition where, if a widget was initialized before the preload,
  everything would fail to load.

## 0.6.0

### Enhancements
* TwitterWidgets update when a bound ID changes.
* Add support for Twitter's [new timeline embedding
  syntax](https://blog.twitter.com/2016/embedding-twitter-timelines-just-got-a-lot-easier).

## 0.5.1
* Emergency release to include an updated changelog with the package

## 0.5.0

### Enhancements
* Add callback capabilities for linked Tweet embeds via
  `twitter-widget-on-rendered`. See the [callback
  demo](./demo/partials/callbacks.html) for more details.

### Fixes
* Address $compile:nonassign error when using twitter-widget-options.
  (@emertechie)

## 0.4.0

### Breaking changes
* Don't use a protocol-relative URL for script loading. It was breaking ngTweet
  in Ionic, and is a practice that is no longer considered appropriate for the
  web. The widgets file is now served via https. If you don't want this, the
  URL can be changed via configuration.

## 0.3.1

### Fixes
* No longer clobber global log and debug states with the production build.

## 0.3.0

### Enhancements
* Added a `twitterTimeline` directive to allow for timeline embeds.

## 0.2.0

### Breaking changes
* The Twitter script is no longer downloaded on page load, meaning embedded
  Tweets not wrapped in `<twitter-widget>` tags will *not* be rendered.  If
  this behavior is desired, please include the `twitterWidgetInitialize`
  directive somewhere within your application.

### Enhancements
* Added a `twitterWidgetInitialize` directive to load the script greedily
  (instead of on-demand).
* Added an optional `twitter-widget-options` attribute to the `twitterWidget`
  directive to allow for Tweet appearance customization.

## 0.1.2

### Fixes
* Widget: Don't use the raw Twitter ID attribute value when linking the
  directive.
* Docs: Fix docs to properly pass in the Twitter ID.

## 0.1.1

### Fixes
* Unscramble Bower dependencies and Bower devDependencies.

## 0.1.0 Initial release
