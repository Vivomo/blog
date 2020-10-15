let gulp = require('gulp'),
    scss = require('gulp-sass'),
    scssSrc = '../scss/**/*.scss';

/**
 * 安装scss 报错参照此网址, 推荐方法2
 * https://github.com/lmk123/blog/issues/28
 *
 * 如果是下面的异常 Error: Node Sass does not yet support your current environment: Windows 64-bit with Unsupported runtime (59)
 * For more information on which environments are supported please see:
 * https://github.com/sass/node-sass/releases/tag/v4.5.3
 * 则npm rebuild node-sass
 */
let gulpScss = () => {
    return gulp.src(scssSrc)
        .pipe(scss({
            linefeed: 'crlf'
            // outputStyle: 'expanded',
            // indentWidth: 4
        }))
        .pipe(gulp.dest('../css'));
};


let gulpScss2 = () => {
    return gulp.src('../src/scss/**/*.scss')
        .pipe(scss({
            linefeed: 'crlf'
            // outputStyle: 'expanded',
            // indentWidth: 4
        }))
        .pipe(gulp.dest('../src/css'));
};

exports.default = gulp.series(gulpScss, gulpScss2);

