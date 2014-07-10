//Gulp variables
var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');
var watch = require('gulp-watch');
var livereload = require('gulp-livereload');
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var pngcrush = require('imagemin-pngcrush');
var minifyHTML = require('gulp-minify-html');
var ftp = require('gulp-ftp');


//Path variables
var SRC  = "./src";
var SRC_LESS_BASE  = path.join(SRC, "less");
var SRC_JAVASCRIPT_BASE  = path.join(SRC, "js");
var SRC_IMAGES_BASE  = path.join(SRC, "img");
var SRC_BOWER_BASE  = path.join(SRC, "bower_components");

var SRC_ALL  = path.join(SRC, "**");
var SRC_HTML  = path.join(SRC, "**", "*.html");
var SRC_LESS_ALL  = path.join(SRC_LESS_BASE, "**", "*.less");
var SRC_JAVASCRIPT_ALL  = path.join(SRC_JAVASCRIPT_BASE, "**", "*.js");
var SRC_IMAGES_ALL  = path.join(SRC_IMAGES_BASE, "**", "*");
var SRC_BOWER_ALL  = path.join(SRC_BOWER_BASE, "**", "*");

var PUBLIC = "./public";
var PUBLIC_LIB = path.join(PUBLIC, "lib");
var PUBLIC_ALL = path.join(PUBLIC, "**");
var PUBLIC_LESS = path.join(PUBLIC, "css");
var PUBLIC_JAVASCRIPT = path.join(PUBLIC, "js");
var PUBLIC_IMAGES = path.join(PUBLIC, "img");
var PUBLIC_BOWER = path.join(PUBLIC, "bower_components");

//Default
gulp.task('default', function() {

});

//Minify HTML
gulp.task('minify-html', function() {
  var opts = {comments:true,spare:true};

  gulp.src(SRC_HTML)
    .pipe(minifyHTML(opts))
    .pipe(gulp.dest(PUBLIC))
    .pipe(livereload());
});

//Htaccess
gulp.task('htaccess', function() {
  gulp.src('./src/.htaccess')
    .pipe(gulp.dest(PUBLIC));
});

//Minimalise Images
gulp.task('imagemin', function() {
  gulp.src(SRC_IMAGES_ALL)
    .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}]
        //use: [pngcrush()]
    }))
    .pipe(gulp.dest(PUBLIC_IMAGES));
});


//LESS
gulp.task('less', function () {
  gulp.src(SRC_LESS_ALL)
  	// .pipe(watch())
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(cssmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(PUBLIC_LESS))
    .pipe(livereload());
});


//Javascript compress
gulp.task('compress', function() {
  gulp.src(SRC_JAVASCRIPT_ALL)
    .pipe(uglify())
    .pipe(gulp.dest(PUBLIC_JAVASCRIPT))
    .pipe(livereload());
});

//Watch
gulp.task('watch', ['less', 'minify-html', 'imagemin', 'compress', 'htaccess'], function() {
  gulp.watch(SRC_LESS_ALL, ['less']);
  gulp.watch(SRC_HTML, ['minify-html']);
  gulp.watch(SRC_IMAGES_ALL, ['imagemin']);
  gulp.watch(SRC_JAVASCRIPT_ALL, ['compress']);
  
  gulp.watch('./src/.htaccess', ['htaccess']);

  gulp.src(SRC_BOWER_ALL)
    	.pipe(gulp.dest(PUBLIC_BOWER));
});

//Upload
gulp.task('upload', function () {
	return gulp.src('./public/**')
	    .pipe(ftp({
	        host: '16158.w58.wedos.net',
	        user: 'w16158_davo',
	        pass: 'TUFVnJVA'
	    }));
});

