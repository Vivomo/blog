let gulp = require('gulp'),
    scss = require('gulp-sass'),
    scssSrc = '../scss/**/*.scss';

let gulpScss = () => {
    return gulp.src(scssSrc)
        .pipe(scss({
            linefeed: 'crlf'
            // outputStyle: 'expanded',
            // indentWidth: 4
        }))
        .pipe(gulp.dest('../css'));
};

let gulpWatch = () => gulp.watch(scssSrc, gulp.series(gulpScss));



exports.default = gulp.series(gulpScss, gulpWatch);
