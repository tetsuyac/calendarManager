var gulp           = require('gulp');
var rename         = require('gulp-rename');
var browserify     = require('gulp-browserify');
var uglify         = require('gulp-uglify');
var less           = require('gulp-less');
var prefix         = require('gulp-autoprefixer');
var minifyCSS      = require('gulp-minify-css');
var jshint         = require('gulp-jshint');
var mochaPhantomjs = require('gulp-mocha-phantomjs');
// lint
gulp.task('lint-client', function () {
  return gulp.src('./client/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});
gulp.task('lint-test', function () {
  return gulp.src('./test/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});
// browserify
gulp.task('browserify-client', ['lint-client'], function () {
  return gulp.src(['client/globalVars.js', 'client/calendarManager.js'])
    .pipe(browserify({
      insertGlobals: true
    }))
    //    .pipe(rename('client-test.js'))
    .pipe(gulp.dest('build'))
    .pipe(gulp.dest('public/javascripts'));
});
gulp.task('browserify-test', ['lint-test'], function () {
  return gulp.src('test/client/index.js')
    .pipe(browserify({
      insertGlobals: true
    }))
    .pipe(rename('client-test.js'))
    .pipe(gulp.dest('build'));
});
// styles
gulp.task('styles', function () {
  return gulp.src('client/less/index.less')
    .pipe(less())
    .pipe(prefix({cascade: true}))
    .pipe(rename('calendarManager.css'))
    .pipe(gulp.dest('build'))
    .pipe(gulp.dest('public/stylesheets'));
});
// minify
gulp.task('minify', ['styles'], function () {
  return gulp.src('build/calendarManager.css')
    .pipe(minifyCSS())
    .pipe(rename('calendarManager.min.css'))
    .pipe(gulp.dest('public/stylesheets'));
});
// uglify
gulp.task('uglify', ['browserify-client'], function () {
  return gulp.src('build/calendarManager.js')
    .pipe(uglify())
    .pipe(rename('calendarManager.min.js'))
    .pipe(gulp.dest('public/javascripts'));
});
// test
gulp.task('test', ['lint-test', 'browserify-test'], function () {
  return gulp.src('test/client/index.html')
    .pipe(mochaPhantomjs());
});
// watch
gulp.task('watch', function () {
//  gulp.watch('client/**/*.js', ['browserify-client', 'test']);
  gulp.watch('client/**/*.js', ['test']);
//  gulp.watch('test/client/**/*.js', ['browserify-test', 'test']);
  gulp.watch('test/client/**/*.js', ['test']);
  gulp.watch('client/**/*.less', ['styles']);
});
// build
gulp.task('build', ['uglify', 'minify']);
//gulp.task('default', ['test', 'build', 'watch']);
//
// default
gulp.task('default', ['test', 'watch']);
