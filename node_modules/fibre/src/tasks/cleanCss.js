module.exports = function(gulp, plugins, config) {

    gulp.task('clean-css', function(cb){
        return plugins.del([config.cssDistPath + '/**/*'], cb);
    });

};