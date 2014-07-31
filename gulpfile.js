//Gulp variables
var gulp   = require('gulp'),
    $      = require('gulp-load-plugins')(), //load all plugins
    watch  = require('gulp-watch'),
    path   = require('path');

var minifyHTML  = require('gulp-minify-html'),
    pngcrush    = require('imagemin-pngcrush'),
    browserSync = require('browser-sync');


//Path variables
var src = './src',
    srcLessBase = path.join(src, 'less'),
    srcLessFile = path.join(src, 'less/main.less'),
    srcBase = path.join(src, 'js'),
    srcImagesBase = path.join(src, 'img'),
    srcBowerBase = path.join(src, 'bower_components');

var srcAll = path.join(src, '**'),
    srcHtml = path.join(src, '**', '*.html'),
    srcLessAll = path.join(srcLessBase, '**', '*.less'),
    srcJavascriptAll = path.join(srcBase, '**', '*.js'),
    srcImagesAll = path.join(srcImagesBase, '**', '*'),
    srcBowerAll = path.join(srcBowerBase, '**', '*');

var dist = './dist',
    distAll = path.join(dist, '**'),
    distLess = path.join(dist, 'css'),
    distJavascript = path.join(dist, 'js'),
    distImages = path.join(dist, 'img'),
    distBower = path.join(dist, 'bower_components');

//Configuration
var config = {
  production: true
}


//Minify HTML
gulp.task('minify-html', function() {
  var opts = {comments:true, spare:true};

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
    .pipe($.less())
      .pipe($.autoprefixer())
      .pipe($.size({title: 'styles'}))
      .pipe($.cssmin())
    
    .pipe($.rename({suffix: '.min'}))
    .pipe($.pako.deflate())//Create deflate
    
    .pipe(gulp.dest(distLess))
      .pipe($.size({title: 'styles min'}))
    .pipe($.livereload());
});


//Javascript compress
gulp.task('compress', function() {
  gulp.src(srcJavascriptAll)
    .pipe($.sourcemaps.init())
    .pipe($.uglify())
    .pipe($.sourcemaps.write('maps'))
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
  //Watch changes (less, html, images, javascript)
  gulp.watch(srcLessAll, ['less']);
  gulp.watch(srcHtml, ['minify-html']);
  gulp.watch(srcImagesAll, ['imagemin']);
  gulp.watch(srcJavascriptAll, ['compress']);
  
  gulp.watch([src+'/*','!'+src+'/*.html'], ['copy']);

  gulp.src(srcBowerAll)
    	.pipe(gulp.dest(distBower));
});


