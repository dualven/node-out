module.exports = function(gulp, plugins, config, browserify, source) {
  
    gulp.task('browserify', function() {
        return browserify('./src/javascript/main.js')
            .bundle()
            .pipe(source('bundle.js'))
            .pipe(plugins.uglify())
            .pipe(gulp.dest('./dist/js/'));
    });

};