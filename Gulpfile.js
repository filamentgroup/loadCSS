var gulp = require('gulp'),
    plugins = require('gulp-load-plugins')(),
    stylish = require('jshint-stylish');

gulp.task('jshint', function () {
    return gulp.src(['./Gulpfile.js', './**/*.js'])
        .pipe(plugins.jshint()
        .pipe(plugins.jshint.reporter(stylish)));
});

gulp.task('qunit', function() {
    return gulp.src('./test/qunit/**/*.html')
        .pipe(plugins.qunit());
});

gulp.task('test',['jshint','qunit']);