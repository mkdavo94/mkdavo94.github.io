// /**
//  * Created by David on 14.12.2018.
//  */
// 'use strict';
//
// global.$ = {
//     gulp: require('gulp'),
//     gp: require('gulp-load-plugins')(),
//     bs: require('browser-sync').create(),
//     path: {
//         tasks: require('./gulp/config/tasks.js')
//     }
// };
//
// $.path.tasks.forEach(function (taskPath) {
//
//     require(taskPath)();
// });
//
//
// $.gulp.task('default', $.gulp.series(
//     $.gulp.parallel('jade', 'stylus'),
//     $.gulp.parallel('watch', 'serve')
// ));
'use strict';

///
global.$ = {
    gulp: require('gulp'),
    del: require('del'),
    gp: require('gulp-load-plugins')(),
    bs: require('browser-sync').create(),
    path: {
        tasks: require('./gulp/config/tasks.js')
    }
};


$.path.tasks.forEach(function (taskPath) {

    require(taskPath)();
});




$.gulp.task('default', $.gulp.series(
    'clean',
   $.gulp.parallel('jade', 'stylus','scripts:lib', 'scripts','img','fonts',"svg"),
   $.gulp.parallel('watch', 'serve')

));