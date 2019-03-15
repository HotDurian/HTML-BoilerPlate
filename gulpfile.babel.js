import gulp from 'gulp';
import del from 'del';
import autoprefixer from 'gulp-autoprefixer';
import concat from 'gulp-concat';
import sass from 'gulp-sass';
import cssnano from 'gulp-cssnano';
import uglify from 'gulp-uglify';
import htmlmin from 'gulp-htmlmin';
import sourcemaps from 'gulp-sourcemaps';
import coffee from 'gulp-coffee';
import browserSync from 'browser-sync';

const server = browserSync.create();

const paths = {
    scripts: {
        src: './src/coffee/',
        dump: './src/scripts/',
        dest: './public/js/'
    },
    styles: {
        src: './src/sass/',
        dest: './public/css/'
    },
    html: {
        src: './src/html/',
        dest: './public/'
    },
    img: {
        src: './src/img/',
        dest: './public/img/'
    }
};

const clean = () => del(['public']);

const compileStyle = () => {
    return gulp.src([
        'node_modules/bootstrap/dist/css/bootstrap.css',
        paths.styles.src + 'index.scss'
    ])
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer('last 4 version'))
        .pipe(cssnano())
        .pipe(sourcemaps.write())
        .pipe(concat('styles.css'))
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(browserSync.reload({
            stream: true
        }));
};

const compileCoffee = () => {
    return gulp.src(paths.scripts.src + '**/*.coffee')
        .pipe(sourcemaps.init())
        .pipe(coffee({bare: true}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.scripts.dump));
};

const compileJS = () => {
    return gulp.src([
        'node_modules/jquery/dist/jquery.js',
        'node_modules/bootstrap/dist/js/bootstrap.js',
        paths.scripts.dump + '**/*.js'
    ])
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest(paths.scripts.dest))
        .pipe(browserSync.reload({
            stream: true,
            once: true
        }));
};

const compileScript = gulp.series(compileCoffee, compileJS);

const compileMarkup = () => {
    return gulp.src(paths.html.src + '**/*.{htm,html}')
        .pipe(htmlmin({collapseWhitespace: true, html5: true}))
        .pipe(gulp.dest(paths.html.dest))
        .pipe(browserSync.reload({
            stream: true
        }));
};

const copyAssets = (cb) => {
    gulp.src(paths.html.src + '*.{xml,txt}')
        .pipe(gulp.dest(paths.html.dest));
    gulp.src(paths.img.src + '**/*.{png,gif,jpg,svg,ico}')
        .pipe(gulp.dest(paths.img.dest));
    cb();
};


const compile = gulp.parallel(copyAssets, compileMarkup, compileScript, compileStyle);


const reload = (cb) => {
    server.reload();
    cb();
};

const serve = (cb) => {
    server.init({
        server: {
            baseDir: paths.html.dest
        }
    });
    cb();
};

const watch = (cb) => {
    gulp.watch(paths.scripts.src + "**/*.coffee", gulp.series(compileScript, reload));
    gulp.watch(paths.html.src + "**/*.{htm,html}", gulp.series(compileMarkup,reload));
    gulp.watch(paths.html.src + "**/*.{xml,txt}", gulp.series(copyAssets));
    gulp.watch(paths.img.src + "**/*.{png,gif,jpg,svg,ico}", gulp.series(copyAssets));
    gulp.watch(paths.styles.src + "**/*.scss", gulp.series(compileStyle));
    cb();
};


const defaultTask = gulp.series(clean, compile, serve, watch);

export default defaultTask;