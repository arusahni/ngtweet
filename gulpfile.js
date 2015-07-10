var gulp = require('gulp');
var concat = require('gulp-concat');
var ngAnnotate = require('gulp-ng-annotate');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var del = require('del');
var serve = require('gulp-serve');

var PATHS = {
  dist: './dist/',
  src: ['./src/app.module.js', './src/*.js']
};

gulp.task('clean', function clean(cb) {
    del([PATHS.dist], cb);
});

gulp.task('build', ['clean'], function build() {
    return gulp.src(PATHS.src)
                .pipe(concat('ngtweet.js'))
                .pipe(ngAnnotate())
                .pipe(gulp.dest(PATHS.dist))
                .pipe(uglify())
                .pipe(rename('ngtweet.min.js'))
                .pipe(gulp.dest(PATHS.dist));
});

gulp.task('serve', ['build'], serve({
    root: ['demo', 'dist']
}));

gulp.task('default', ['build']);
