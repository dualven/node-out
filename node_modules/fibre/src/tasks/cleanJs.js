module.exports = function(gulp, plugins, config) {

    gulp.task('clean-js', function(cb){
        return plugins.del([config.jsDistPath + '/**/*'], cb);
    });

};