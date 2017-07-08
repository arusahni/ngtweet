var gulp = require('gulp');
var concat = require('gulp-concat');
var ngAnnotate = require('gulp-ng-annotate');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var del = require('del');
var serve = require('gulp-serve');
var sync = require('gulp-config-sync');

var PATHS = {
    dist: './dist/',
    src: ['./src/app.module.js', './src/*.js'],
    prodSettings: './src/prod.config.js'
};

PATHS.src.push('!' + PATHS.prodSettings);

gulp.task('clean', function clean(cb) {
    del([PATHS.dist], cb);
});

gulp.task('build:dev', ['clean'], function buildDev() {
    return gulp.src(PATHS.src)
                .pipe(concat('ngtweet.js'))
                .pipe(ngAnnotate())
                .pipe(gulp.dest(PATHS.dist));
});

gulp.task('build:prod', ['clean', 'build:dev'], function build() {
    return gulp.src([PATHS.dist + 'ngtweet.js', PATHS.prodSettings])
                .pipe(ngAnnotate())
                .pipe(concat('ngtweet.min.js'))
                .pipe(uglify({
                    'preserveComments': 'some'
                }))
                .pipe(gulp.dest(PATHS.dist));
});

gulp.task('build', ['build:dev', 'build:prod']);

gulp.task('serve', ['build'], serve({
    root: ['demo', 'dist']
}));

gulp.task('syncVersions', function syncVersions() {
    gulp.src('bower.json')
        .pipe(sync())
        .pipe(gulp.dest('.'));
});

gulp.task('default', ['build']);
