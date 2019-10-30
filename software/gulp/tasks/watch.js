module.exports=function () {
    $.gulp.task('watch',
        function () {
            $.gulp.watch('src/pug/**/*.jade', $.gulp.series('jade'));
            $.gulp.watch('src/static/sass/**/*.css', $.gulp.series('stylus'));
            $.gulp.watch('src/static/img/svg/**/*.svg', $.gulp.series('svg'));
            $.gulp.watch('src/static/img/**/*.png', $.gulp.series('svg'));
            $.gulp.watch('src/static/js/**/*.js', $.gulp.series('scripts'))

        });
};