//Gulp variables
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var path = require('path');
var watch = require('gulp-watch');
var minifyHTML = require('gulp-minify-html');
var pngcrush = require('imagemin-pngcrush');

// var less = require('gulp-less');
// var livereload = require('gulp-livereload');
// var cssmin = require('gulp-cssmin');
// var rename = require('gulp-rename');
// var uglify = require('gulp-uglify');
// var imagemin = require('gulp-imagemin');

var ftp = require('gulp-ftp');
var browserSync = require('browser-sync');


//Path variables
var src = './src';
var srcLessBase = path.join(src, 'less');
var srcLessFile = path.join(src, 'less/all.less');
var srcBase = path.join(src, 'js');
var srcImagesBase = path.join(src, 'img');
var srcBowerBase = path.join(src, 'bower_components');

var srcAll = path.join(src, '**');
var srcHtml = path.join(src, '**', '*.html');
var srcLessAll = path.join(srcLessBase, '**', '*.less');
var srcJavascriptAll = path.join(srcBase, '**', '*.js');
var srcImagesAll = path.join(srcImagesBase, '**', '*');
var srcBowerAll = path.join(srcBowerBase, '**', '*');

var dist = './dist';
var distAll = path.join(dist, '**');
var distLess = path.join(dist, 'css');
var distJavascript = path.join(dist, 'js');
var distImages = path.join(dist, 'img');
var distBower = path.join(dist, 'bower_components');



//Minify HTML
gulp.task('minify-html', function() {
  var opts = {comments:true,spare:true};

  gulp.src(srcHtml)
    .pipe(minifyHTML(opts))
    .pipe(gulp.dest(dist))
    .pipe($.size({title: 'html'}))
    .pipe($.livereload());
});


// Copy all files from SRC to DIST
gulp.task('copy', function () {
  return gulp.src([src+'/*','!'+src+'/*.html'], {dot: true})
    .pipe(gulp.dest(dist))
    .pipe($.size({title: 'copy'}))
    .pipe($.livereload());
});

//Minimalise Images
gulp.task('imagemin', function() {
  gulp.src(srcImagesAll)
    .pipe($.cache($.imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngcrush()]
    })))
    .pipe(gulp.dest(distImages))
    .pipe($.size({title: 'images'}));
});


//LESS
gulp.task('less', function () {
  gulp.src(srcLessFile)
  	// .pipe(watch())
    .pipe($.sourcemaps.init())
    .pipe($.less())
    // .pipe($.less({
      // modifyVars:true,
      // paths: [ path.join(__dirname, 'less', 'includes') ]
      // paths: [ './src/less/all.less' ]
    // }))
    .pipe($.autoprefixer())
    .pipe($.cssmin())
    .pipe($.rename({suffix: '.min'}))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(distLess))
    .pipe($.size({title: 'styles'}))
    .pipe($.livereload());
});


//Javascript compress
gulp.task('compress', function() {
  gulp.src(srcJavascriptAll)
    .pipe($.uglify())
    .pipe(gulp.dest(distJavascript))
    .pipe($.size({title: 'javascript'}))
    .pipe($.livereload());
});


// Static server
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: ['dist']
        }
    });
});

//Default
gulp.task('default', function() {

});

//Watch
gulp.task('watch', ['less', 'minify-html', 'imagemin', 'compress', 'copy', 'browser-sync'], function() {
  gulp.watch(srcLessAll, ['less']);
  gulp.watch(srcHtml, ['minify-html']);
  gulp.watch(srcImagesAll, ['imagemin']);
  gulp.watch(srcJavascriptAll, ['compress']);
  
  gulp.watch([src+'/*','!'+src+'/*.html'], ['copy']);

  gulp.src(srcBowerAll)
    	.pipe(gulp.dest(distBower));
});


