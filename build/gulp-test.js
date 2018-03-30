let gulp = require('gulp');
let babel = require('gulp-babel');
let webpack = require('gulp-webpack');

gulp.task('es5', () => {
    gulp.src('./script/**/*.js')
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(webpack({//babel编译import会转成require，webpack再包装以下代码让代码里支持require
            module: {
                loaders: [{
                    test: /.js$/,
                    loader: 'babel-loader',
                    // exclude: /node_modules/,
                    query: {
                        presets: ['es2015']
                    }
                }]
            },
            output: {
                filename: '[name].js'
            }
        }))
        .pipe(gulp.dest('./js'))
});


gulp.task('default', ['es5'])