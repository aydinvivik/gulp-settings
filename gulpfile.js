const gulp = require( 'gulp' )
const sass = require( 'gulp-sass' )
const sourcemaps = require('gulp-sourcemaps')
const autoprefixer = require( 'gulp-autoprefixer' )
const minifyCSS = require( 'gulp-clean-css' )
const rtlcss = require('gulp-rtlcss')
const rename = require('gulp-rename')
const concat = require( 'gulp-concat' )
const uglify = require( 'gulp-uglify' )
const browserSync = require('browser-sync').create()

const path = {
    sass: './includes/assets/sass',
    css: './includes/assets/css',
    js: './includes/assets/js',
    vendor: './includes/assets/js/vendor'
}

const styles = () => {
    return gulp.src( path.sass + '/base.scss' )
    .pipe( sourcemaps.init() )
    .pipe( sass({
        includePaths: [ 'node_modules/foundation-sites/scss' ]
    }).on( 'error', sass.logError ))
    .pipe( autoprefixer() )
    .pipe( minifyCSS() )
    .pipe( gulp.dest( path.css ) )
    .pipe( rtlcss() )
    .pipe( rename( { suffix: '-rtl' } ))
    .pipe( sourcemaps.write( 'dist' ))
    .pipe( gulp.dest( path.css ) )
    .pipe( browserSync.stream() );
}

const vendor = () => {
    return gulp.src( path.vendor + '/**/*.js' )
    .pipe( sourcemaps.init() )
    .pipe( concat( 'vendor.js' ) )
    .pipe( uglify() )
    .pipe( sourcemaps.write( 'dist' ))
    .pipe( gulp.dest( path.js ) )
    .pipe( browserSync.stream() );
}

const javascript = () => {
    return gulp.src( path.js + '/bundle.js' )
    .pipe( browserSync.stream() );
}

const watch = () => {      
    browserSync.init({
        server: {
            baseDir: './'
        },
        startPath: '/html'
    })
    gulp.watch( path.sass + '/**/*.scss', styles ).on( 'change', browserSync.reload );
    gulp.watch( path.vendor + '/**/*.js', vendor ).on( 'change', browserSync.reload );
    gulp.watch( path.js + '/bundle.js', javascript ).on( 'change', browserSync.reload );
}

exports.styles = styles;
exports.vendor = vendor;
exports.javascript = javascript;
exports.watch = watch;

var build = gulp.series( watch, gulp.parallel( styles, vendor, javascript ) );

gulp.task( 'default', build );