const	gulp			= require('gulp'),
		autoprefixer	= require('autoprefixer'),
		del 			= require('delete'),
		postcss			= require('gulp-postcss'),
		pug				= require('gulp-pug'),
		sass			= require('gulp-sass')(require('sass')),
		browsersync		= require('browser-sync').create();


/*----- directories -----------------------------------------------*/
const dir = {
	src:	'./_src/',		// where our source files live
	dest:	'./_site/',		// where we build our files to
};


/*----- clobber the build directory -------------------------------*/
function clean() {
	return del(
		dir.dest,
	);
}

/*----- compile Pug files to html ---------------------------------*/
const htmlConfig = {
	src:	dir.src		+ '_pug/**/*.pug',
	watch:	dir.src		+ '_pug/**/*.pug',
	dest:	dir.dest,
};

function html() {
	return gulp.src(htmlConfig.src)
		.pipe(pug({
			pretty: true
		}))
		.pipe(gulp.dest(htmlConfig.dest))
	;
}

/*----- compile SASS to CSS ---------------------------------------*/
const cssConfig = {
	src:	dir.src		+ '_sass/**/*',
	watch:	dir.src		+ '_sass/**/*',
	dist:	dir.dest 	+ 'css/',

	postCSS: [
		autoprefixer(), // browser options moved to package.json
		// cssnano()
	]
};

function css() {
	return gulp.src(cssConfig.src)
		.pipe(sass({
			outputStyle: 'expanded'
		}).on('error', sass.logError))
		.pipe(postcss(cssConfig.postCSS))
		.pipe(gulp.dest(cssConfig.dist))
		.pipe(browsersync.stream())
	;
}


/*----- process images --------------------------------------------*/
const imgConfig = {
	src:	dir.src		+ '_assets/**/*',
	watch:	dir.src		+ '_assets/**/*',
	dist:	dir.dest	+ 'assets/',
};

function images() {
	return gulp.src(imgConfig.src)
		// .pipe(imagemin(imgConfig.plugins))
		.pipe(gulp.dest(imgConfig.dist))
		.pipe(browsersync.stream())
	;
}


/*----- browserSync -----------------------------------------------*/
function browserSync(done) {
	browsersync.init({
		server: {
			baseDir: dir.dest,
		},
		notify:	false,
		injectChanges: true,
	});
	done();
}

// browserSync Reload
function browserSyncReload(done) {
	browsersync.reload();
	done();
}


/*----- watch tasks -----------------------------------------------*/
function watchFiles() {
	gulp.watch(cssConfig.watch, css);
	gulp.watch(htmlConfig.watch, html);
	gulp.watch(
		[
			dir.dest		+ '*.html',
		],
		gulp.series(browserSyncReload)
	);
	gulp.watch(imgConfig.watch, images);
}


/*----- gulp routines ---------------------------------------------*/
const build		= gulp.series(clean, html, gulp.parallel(css, images));
const watch		= gulp.parallel(watchFiles, browserSync);


/*----- export tasks ----------------------------------------------*/
exports.clean	= clean;
exports.html	= html;
exports.css		= css;
exports.images	= images;
exports.build	= build;
exports.watch	= watch;
exports.default	= gulp.series(build, watch);


/*-----------------------------------------------------------------*/

