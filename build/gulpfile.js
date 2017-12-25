var gulp = require('gulp'),
    less = require('gulp-less'),
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
 */
gulp.task('scss', function () {
    gulp.src(scssSrc)
        .pipe(scss({
            // outputStyle: 'expanded',
            // indentWidth: 4
        }))
        .pipe(gulp.dest('../css'));
});


gulp.task('testWatch', function () {
    gulp.watch(scssSrc, ['scss']);
});

gulp.task('default', ['scss', 'testWatch']);