let gulp = require('gulp'),
    scss = require('gulp-sass'),
    scssSrc = ['./drawingBoard/scss/**/*.scss',];

gulp.task('scss', function () {
    gulp.src(scssSrc)
        .pipe(scss({
            linefeed: 'crlf'
        }))
        .pipe(gulp.dest('./drawingBoard/css'));
});


gulp.task('testWatch', function () {
    gulp.watch(scssSrc, ['scss']);
});

gulp.task('default', ['scss', 'testWatch']);
