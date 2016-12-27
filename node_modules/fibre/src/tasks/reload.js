module.exports = function(gulp, plugins){

    return gulp.task('reload', function () {
        plugins.browserSync.reload();
    });

};