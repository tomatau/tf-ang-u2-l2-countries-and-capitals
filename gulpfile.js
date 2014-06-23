var gulp = require('gulp')
    ,sass = require('gulp-sass')
;

var roots = {
        app: './app'
        ,bower: './bower_components'
    },
    paths = {
        css : roots.app + '/css'
        ,scss : roots.app + '/css/scss/style.scss'
        ,bootstrap : roots.bower + '/bootstrap-sass-official/vendor/assets/stylesheets'
    };

/**
 * SCRIPTS
 */
// sass --style expanded --update ./app/css/style.scss:./app/css/style.css // compressed, nested (compact)
gulp.task('styles', [], function(){
    return gulp.src(paths.scss)
        .pipe(sass({
            errLogToConsole: true
            ,includePaths: [ paths.bootstrap ]
            ,outputStyle: 'expanded'
        }))
        .pipe( gulp.dest(paths.css) );
});