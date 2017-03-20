var fs = require('fs');
var gulp    = require('gulp');
var uglify  = require('gulp-uglify');
var minifycss  = require('gulp-minify-css');
var config = require('./config');

gulp.task('js', function () {
    gulp.src(config.websrcroot + '/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest(config.webgenroot));

	gulp.src(config.webassetsroot + '/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest(config.webassetsroot));
});

gulp.task('css', function () {
    gulp.src(config.websrcroot + '/**/*.css')
        .pipe(minifycss())
        .pipe(gulp.dest(config.webgenroot));
});