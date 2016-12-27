module.exports = function(gulp, plugins, config) {

    gulp.task('imagemin', function(){

        return gulp.src(config.imgSrcPath + '/**/*')
            .pipe(plugins.plumber({
              errorHandler: plugins.notify.onError("ERROR: Image Minification Failed")
            }))
            .pipe(plugins.newer(config.imgDistPath))
            .pipe(plugins.imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
            .pipe(gulp.dest(config.imgDistPath));

    });

};