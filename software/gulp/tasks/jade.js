module.exports=function () {
    $.gulp.task('jade', function () {
        return $.gulp.src('src/pug/pages/*.jade')
            .pipe($.gp.jade({
                pretty: true
            }))
            .pipe($.gulp.dest('build'))
            .on('end',$.bs.reload)
    });
};