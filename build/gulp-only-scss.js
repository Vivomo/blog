let gulp = require('gulp'),
    scss = require('gulp-sass'),
    scssSrc = '../scss/**/*.scss';

gulp.task('scss', function () {
    gulp.src(scssSrc)
        .pipe(scss({
            linefeed: 'crlf'
            // outputStyle: 'expanded',
            // indentWidth: 4
        }))
        .pipe(gulp.dest('../css'));
});



gulp.task('testWatch', function () {
    gulp.watch(scssSrc, ['scss']);
});

gulp.task('default', ['scss', 'scss2', 'testWatch']);