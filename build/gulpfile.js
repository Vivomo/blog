var gulp = require('gulp'),
    less = require('gulp-less');

gulp.task('testLess', function () {
    gulp.src('less/big-screen.less')
        .pipe(less())
        .pipe(gulp.dest('css'));
});
