module.exports = function(gulp, plugins){

    return gulp.task('css-build', function(){

      plugins.runSequence('clean-css', ['csscompile', 'cachebust'], 'map-reference', 'reload');

    });

};
