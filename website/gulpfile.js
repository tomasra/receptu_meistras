 'use strict';

var gulp = require('gulp'),
    rename = require('gulp-rename'),
    gutil = require('gulp-util'),
    plumber = require('gulp-plumber'),
    portfinder = require('portfinder'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    nested = require("postcss-nested"),
    cssnext = require("gulp-cssnext"),
    vars = require('postcss-simple-vars'),
    nano = require('gulp-cssnano'),
    browserSync = require("browser-sync"),
    reload = browserSync.reload,
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    eslint = require('gulp-eslint'),
    include = require("gulp-html-tag-include");

// Ресурсы проекта
var paths = {
  styles: 'dev/styles/',
  stylesFirst: 'dev/style.css',
  stylesSecond: 'dev/**/style.css',
  stylesThird: 'dev/**/**/style.css',
  css: '',
  scripts: 'dev/scripts/',
  js: '',
  templates: 'dev/',
  templatesFirst: 'dev/*.html',
  templatesSecond: 'dev/**/*.html',
  templatesThird: 'dev/**/**/*.html',
  html: ''
};

// Одноразовая сборка проекта
gulp.task('default', function() {
  gulp.start('chepulis-first', 'chepulis-second', 'chepulis-third', 'styles-first', 'styles-second', 'styles-third', 'scripts');
});

// Запуск живой сборки
gulp.task('live', function() {
  gulp.start('server', 'chepulis-first', 'chepulis-second', 'chepulis-third', 'styles-first', 'styles-second', 'styles-third', 'scripts');
});

// Туннель
gulp.task('external-world', function() {
  gulp.start('web-server', 'chepulis-first', 'chepulis-second', 'chepulis-third',  'styles-first', 'styles-second', 'styles-third', 'scripts', 'watch');
});

// Федеральная служба по контролю за оборотом файлов
gulp.task('watch', function() {
  gulp.watch(paths.styles + '**/*.css', ['styles-first', 'styles-second', 'styles-third']);
  gulp.watch(paths.styles + '**/*.css', ['styles-first']);
  gulp.watch(paths.styles + '**/*.css', ['styles-second']);
  gulp.watch(paths.styles + '**/*.css', ['styles-third']);
  gulp.watch(paths.scripts + '*.js', ['scripts']);
  gulp.watch(paths.templates + '*.html', ['chepulis-first', 'html']);
  gulp.watch(paths.templates + '**/*.html', ['chepulis-second', 'html']);
  gulp.watch(paths.templates + '**/**/*.html', ['chepulis-third', 'html']);
  gulp.watch(paths.templates + 'blocks/*.html', ['chepulis-third', 'chepulis-second', 'chepulis-first', 'html']);
});

//Шаблонизация
gulp.task('chepulis-first', function() {
  return gulp.src(paths.templatesFirst)
  .pipe(include())
  .pipe(plumber({errorHandler: onError}))
  .pipe(gulp.dest(paths.html));
});

gulp.task('chepulis-second', function() {
  return gulp.src(paths.templatesSecond)
  .pipe(include())
  .pipe(plumber({errorHandler: onError}))
  .pipe(gulp.dest(paths.html));
});

gulp.task('chepulis-third', function() {
  return gulp.src(paths.templatesThird)
  .pipe(include())
  .pipe(plumber({errorHandler: onError}))
  .pipe(gulp.dest(paths.html));
});

// Компиляция стилей, добавление префиксов
gulp.task('styles-first', function () {
  var processors = [
    vars,
    nested
  ];
  return gulp.src(paths.stylesFirst)
  .pipe(plumber({errorHandler: onError}))
  .pipe(cssnext())
  .pipe(postcss(processors))
  .pipe(nano({convertValues: {length: false}}))
  .pipe(gulp.dest(paths.css))
});

gulp.task('styles-second', function () {
  var processors = [
    vars,
    nested
  ];
  return gulp.src(paths.stylesSecond)
  .pipe(plumber({errorHandler: onError}))
  .pipe(cssnext())
  .pipe(postcss(processors))
  .pipe(nano({convertValues: {length: false}}))
  .pipe(gulp.dest(paths.css))
});

gulp.task('styles-third', function () {
  var processors = [
    vars,
    nested
  ];
  return gulp.src(paths.stylesThird)
  .pipe(plumber({errorHandler: onError}))
  .pipe(cssnext())
  .pipe(postcss(processors))
  .pipe(nano({convertValues: {length: false}}))
  .pipe(gulp.dest(paths.css))
});




// Сборка и минификация скриптов
gulp.task('scripts', function() {
  return gulp.src(paths.scripts + '*.js')
  .pipe(plumber({errorHandler: onError}))
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(concat('scripts.js'))
  .pipe(uglify())
  .pipe(gulp.dest(paths.js))
  .pipe(reload({stream: true}));
});






// Запуск локального сервера
gulp.task('server', function() {
  portfinder.getPort(function (err, port){
    browserSync({
      server: {
        baseDir: "."
      },
      host: 'localhost',
      notify: false,
      port: port
    });
  });
});

// Запуск локального сервера c туннелем
gulp.task('web-server', function() {
  portfinder.getPort(function (err, port){
    browserSync({
      server: {
        baseDir: "."
      },
      tunnel: true,
      host: 'localhost',
      notify: false,
      port: port
    });
  });
});

// Рефреш ХТМЛ-страниц
gulp.task('html', function () {
  gulp.src(paths.html + '*.html')
  .pipe(reload({stream: true}));
});

// Ошибки
var onError = function(error) {
  gutil.log([
    (error.name + ' in ' + error.plugin).bold.red,
    '',
    error.message,
    ''
  ].join('\n'));
  gutil.beep();
  this.emit('end');
};
