var gulp = require('gulp'),
    scss = require('gulp-sass'),
    scssSrc = '../scss/**/*.scss';
    // scssSrc = '../scss/calendar.scss';

// gulp.task('testLess', function () {
//     gulp.src('../less/questionnaire-survey.less')
//         .pipe(less())
//         .pipe(gulp.dest('../css'));
// });
/**
 * 安装scss 报错参照此网址, 推荐方法2
 * https://github.com/lmk123/blog/issues/28
 *
 * 如果是下面的异常 Error: Node Sass does not yet support your current environment: Windows 64-bit with Unsupported runtime (59)
 * For more information on which environments are supported please see:
 * https://github.com/sass/node-sass/releases/tag/v4.5.3
 * 则npm rebuild node-sass
 */
gulp.task('scss', function () {
    gulp.src(scssSrc)
        .pipe(scss({
            // outputStyle: 'expanded',
            // indentWidth: 4
        }))
        .pipe(gulp.dest('../css'));
});

let shareCss = '../ignore/share/scss/share.scss'
gulp.task('share', function () {
    gulp.src(shareCss)
        .pipe(scss({
            // outputStyle: 'expanded',
            // indentWidth: 4
        }))
        .pipe(gulp.dest('../ignore/share/css'));
});



gulp.task('testWatch', function () {
    gulp.watch(shareCss, ['scss', 'share']);
});

gulp.task('default', ['scss', 'testWatch', 'share']);