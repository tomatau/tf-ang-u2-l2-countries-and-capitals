var gulp = require('gulp')
    ,sass = require('gulp-sass')
;

var roots = {
        app: './app'
    },
    paths = {
        css : roots.app + '/css', 
        scss : roots.app + '/css/style.scss'
    };

/**
 * SCRIPTS
 */

// sass --style expanded --update ./app/css/style.scss:./app/css/style.css
gulp.task('styles', [], function(){
    gulp.src(paths.scss)
        .pipe(sass({
            errLogToConsole: true,
            // compressed, nested (compact)
            outputStyle: 'expanded'
        }))
        .pipe(
            gulp.dest(paths.css)
        );
});