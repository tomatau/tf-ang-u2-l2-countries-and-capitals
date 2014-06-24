var gulp = require('gulp')
    ,sass = require('gulp-sass')
    ,clean = require('gulp-clean')
    ,usemin = require('gulp-usemin')
    ,ngmin = require('gulp-ngmin')
    ,uglify = require('gulp-uglify')
    ,minifyCss = require('gulp-minify-css')
;

var roots = {
        app: './app'
        ,bower: './bower_components'
        ,build: './build'
    },
    indexFile = roots.app + '/index.html';
    paths = {
        css : roots.app + '/css'
        ,scss : roots.app + '/css/scss/style.scss'
        ,bootstrap : roots.bower + '/bootstrap-sass-official/vendor/assets/stylesheets'
        ,html: [
            roots.app + '/**/*.html'
            ,'!' + indexFile
        ]
    };

/**
 * SCRIPTS
 */
// sass --style expanded --update ./app/css/style.scss:./app/css/style.css // compressed, nested (compact)
gulp.task('styles', [], function(){
    return gulp.src( paths.scss )
        .pipe(sass({
            errLogToConsole: true
            ,includePaths: [ paths.bootstrap ]
            ,outputStyle: 'expanded'
        }))
        .pipe( gulp.dest( paths.css ) );
});


/**
 * Build Scripts
 */

gulp.task('clean', function(){
    return gulp.src( roots.build, { read: false } )
        .pipe( clean() );
});

gulp.task('html', [ 'clean' ], function(){
    gulp.src( paths.html )
        .pipe( gulp.dest( roots.build ) );
});

gulp.task('usemin', [ 'html' ], function(){
    gulp.src( indexFile )
        .pipe(usemin({
            css: [ minifyCss(), 'concat' ],
            vendor: [ uglify() ],
            js: [ ngmin() ]
        }))
        .pipe( gulp.dest( roots.build ) );
})




