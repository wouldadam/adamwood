var gulp = require('gulp');
var csso = require('gulp-csso');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var cp = require('child_process');
var imagemin = require('gulp-imagemin');
var browserSync = require('browser-sync');

var jekyllCommand = (/^win/.test(process.platform)) ? 'jekyll.bat' : 'jekyll';

/*
 * Build the Jekyll Site
 * runs a child process in node that runs the jekyll commands
 */
function jekyllBuild(done) {
	return cp.spawn(jekyllCommand, ['build'], { stdio: 'inherit' })
		.on('close', done);
};

/*
 * Rebuild Jekyll & reload browserSync
 */
function jekyllRebuild() {
	browserSync.reload();
};

/*
 * Build the jekyll site and launch browser-sync
 */
function browserSync() {
	browserSync({
		server: {
			baseDir: '_site'
		},

	});
};

// /*
// * Compile and minify sass
// */
function css() {
	return gulp.src('src/styles/**/*.scss')
		.pipe(plumber())
		.pipe(sass())
		.pipe(csso())
		.pipe(gulp.dest('assets/css'));
};

/*
 * Minify images
 */
function imageMin() {
	return gulp.src('src/img/**/*.{jpg,png,gif}')
		.pipe(plumber())
		.pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
		.pipe(gulp.dest('assets/img/'));
};

/**
 * Compile and minify js
 */
function js() {
	return gulp.src('src/js/**/*.js')
		.pipe(plumber())
		.pipe(concat('main.js'))
		.pipe(uglify())
		.pipe(gulp.dest('assets/js/'))
};

function watch() {
	gulp.watch('src/styles/**/*.scss', css);
	gulp.watch('src/js/**/*.js', js);
	gulp.watch('src/img/**/*.{jpg,png,gif}', imageMin);
	gulp.watch(['*html', '_includes/*html', '_layouts/*.html'], jekyllRebuild);
};

exports.build = gulp.series(js, css, jekyllBuild)
exports.watch = gulp.series(exports.build, browserSync, watch)
exports.default = exports.watch