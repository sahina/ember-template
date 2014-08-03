'use strict';

var appPackage = require('./package');
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var clean = require('gulp-rimraf');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var zip = require('gulp-zip');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var gulpif = require('gulp-if');
var inject = require('gulp-inject');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var webserver = require('gulp-webserver');
var handlebars = require('gulp-ember-handlebars');
var es = require('event-stream');
var cssmin = require('gulp-cssmin');
var gulpif = require('gulp-if');
var streamify = require('gulp-streamify');


// node env to decide build target
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

function isProd() {
  return process.env.NODE_ENV === 'production';
}


// ************************************************************************************
//  CLEAN UP
// ************************************************************************************

gulp.task('clean', function() {
  gulp.src('build', {
    read: false
  })
    .pipe(clean({
      force: true
    }));
});


gulp.task('cleanDist', function() {
  gulp.src('dist', {
    read: false
  })
    .pipe(clean({
      force: true
    }));
});



// ************************************************************************************
//  ASSETS (images, fonts)
// ************************************************************************************

gulp.task('assets-images', function() {
  gulp.src('www/img/**/*', {
    base: './www/img'
  })
    .pipe(gulp.dest('build/img'));
});


gulp.task('assets', ['assets-images']);



// ************************************************************************************
//  LIBS and VENDOR scripts
// ************************************************************************************


gulp.task('libs-main', function() {

  gulp.src([
    'www/libs/lodash/dist/lodash.js',
    'www/libs/jquery/dist/jquery.js',
    'www/libs/handlebars/handlebars.js',
    'www/libs/ember/ember.js',
    'www/libs/ember-data/ember-data.js',
    'www/libs/moment/moment.js'
  ])
    .pipe(concat('libs.js'))
    .pipe(gulpif(isProd, uglify()))
    .pipe(gulp.dest('build/js'));

});

gulp.task('libs', ['libs-main']);



// ************************************************************************************
//  APP SCRIPTS
// ************************************************************************************


var appScripts = [
  'www/js/app.js',
  'www/js/mixins/**/*.js',
  'www/js/helpers/**/*.js',
  'www/js/routes/**/*.js',
  'www/js/models/**/*.js',
  'www/js/components/**/*.js',
  'www/js/controllers/**/*.js',
  'www/js/views/**/*.js',
  'www/js/**/*.js'
];


// ember scripts won't be browserified
gulp.task('scripts', function() {
  gulp.src(appScripts)
    .pipe(concat('app.js'))
    .pipe(gulpif(isProd, uglify()))
    .pipe(gulp.dest('build/js'));
});


gulp.task('browserify', function() {

  var b = browserify({
    insertGlobals: false,
    debug: true,
    entries: './www/js-bundle/main.js'
  });

  b.require('jwt-decode');

  b.bundle()
    .pipe(source('bundle.js'))
    .pipe(streamify(gulpif(isProd, uglify())))
    .pipe(gulp.dest('build/js'));
});



// ************************************************************************************
//  LINT scripts
// ************************************************************************************

gulp.task('lint', function() {
  gulp.src(appScripts)
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'));
});



// ************************************************************************************
//  HTML and TEMPLATES
// ************************************************************************************

gulp.task('html', function() {
  gulp.src('www/index.html')
    .pipe(gulp.dest('build'));
});


gulp.task('templates', function() {
  gulp.src('www/templates/**/*.{hbs,html}')
    .pipe(handlebars({
      outputType: 'browser'
    }))
    .pipe(concat('templates.js'))
    .pipe(gulpif(isProd, uglify()))
    .pipe(gulp.dest('build/js'));
});



// ************************************************************************************
//  STYLES (CSS / SCSS)
// ************************************************************************************

gulp.task('styles-main', function() {

  gulp.src('www/style/app.scss')
    .pipe(sass())
  .pipe(gulpif(isProd, cssmin()))
  .pipe(gulp.dest('build/css'));

});

gulp.task('styles', ['styles-main']);



// ************************************************************************************
//  WATCH
// ************************************************************************************

gulp.task('watchsrc', function() {

  // js script files
  gulp.watch('www/js/**/*.js', ['lint', 'scripts']);

  // js script files
  gulp.watch('www/js-bundle/**/*.js', ['lint', 'browserify']);

  // style files
  gulp.watch('www/style/**/*.scss', ['styles']);

  // index html
  gulp.watch('www/index.html', ['html']);

  // templates files
  gulp.watch('www/templates/**/*', ['templates']);

});




// ************************************************************************************
//  ZIP
// ************************************************************************************

gulp.task('zip', function () {
  var fileName = appPackage.name +
    '-' +
    appPackage.version +
    '__' +
    new Date().getTime() +
    '.zip';

  gulp.src('build/**/*')
    .pipe(zip(fileName))
    .pipe(gulp.dest('dist'));
});



// ************************************************************************************
//  DEV Livereload Server
// ************************************************************************************

gulp.task('webserver', ['build'], function() {
  gulp.src('build')
    .pipe(webserver({
      livereload: true,
      port: 5000
    }));
});



// ************************************************************************************
//  BUILD and DEFAULT tasks
// ************************************************************************************

gulp.task('build', [
  'html',
  'templates',
  'assets',
  'styles',
  'libs',
  'lint',
  'scripts',
  'browserify'
]);

gulp.task('default', ['build']);

gulp.task('watch', ['build', 'webserver', 'watchsrc']);

gulp.task('package', ['build', 'zip']);