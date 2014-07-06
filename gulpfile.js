var gulp        = require('gulp'),
    concat      = require('gulp-concat'),
    changed     = require('gulp-changed'),
    uglify      = require('gulp-uglify'),
    coffee      = require('gulp-coffee'),
    stylus      = require('gulp-stylus'),
    plumber     = require('gulp-plumber'),
    gutil       = require('gulp-util'),
    livereload  = require('gulp-livereload'),
    nodemon     = require('gulp-nodemon');

// Public Directory to watch for changes
var publicDir = {
  stylus: "./public/style/**/*.{styl,css}",
  js: "./public/js/*.js",
  coffee: "./public/js/coffee/*.coffee"
};

// Views Directory
var viewsDir = "./views/**/*.html";

gulp.task('stylus', function() {
  gulp.src(publicDir.stylus)
    .pipe(plumber())
    .pipe(stylus({
      set:['compress']
    }))
    .pipe(gulp.dest('./public/'))
    .pipe(livereload());
});

gulp.task('html', function() {
  gulp.src(viewsDir)
    .pipe(livereload());
});

gulp.task('coffee', function() {
  gulp.src(publicDir.coffee)
    .pipe(plumber())
    .pipe(coffee({bare: true}).on('error', gutil.log))
    .pipe(gulp.dest('./public/js/'))
    .pipe(livereload());
});

gulp.task('js', function() {
  gulp.src(publicDir.js)
    .pipe(plumber())
    .pipe(livereload());
});

// Watcher
gulp.task('watch', function() {
  gulp.watch(publicDir.stylus, ['stylus']);
  gulp.watch(publicDir.coffee, ['coffee']);
  gulp.watch(publicDir.js, ['js']);
  gulp.watch(viewsDir, ['html']);
});

// Nodemon task
gulp.task('demon', function () {
  nodemon({
    script: 'index.js',
    ext: 'js html css',
    env: {
      'NODE_ENV': 'development'
    }
  })
    .on('start', ['watch'])
    .on('change', ['watch'])
    .on('restart', function () {
      gutil.log('Restarted!');
    })
    .on('crash', function ( err ) {
      gutil.log(err);
      gutil.beep();
    });
});

// Default task
gulp.task('default', ['demon']);
