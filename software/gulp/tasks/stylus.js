module.exports=function () {
    $.gulp.task('stylus', function () {
        return $.gulp.src('src/static/sass/main.css')
            .pipe($.gp.sourcemaps.init())

            .pipe($.gp.stylus({
                'include css':true
            }))
            .pipe($.gp.autoprefixer({
                browsers: ['last 10 versions']
            }))
            .on("error", $.gp.notify.onError({

                title: "stile"
            }))
            .pipe($.gp.csso())
            .pipe($.gp.sourcemaps.write())
            .pipe($.gulp.dest('build/static/css'))
            .pipe($.bs.reload({
                stream:true
            }));

    });
};