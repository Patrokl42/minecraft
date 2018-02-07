var gulp = require('gulp');
const imagemin = require('gulp-imagemin');
var pug = require('gulp-pug');
var sass = require('gulp-sass');
var server = require('gulp-server-livereload');
var plumber = require('gulp-plumber');
var plumberNotifier = require('gulp-plumber-notifier');
const autoprefixer = require('gulp-autoprefixer');
var browserify = require('browserify'),
    watchify = require('watchify'),
    source = require('vinyl-source-stream'),
    sourceFile = './dev/js/script.js',
    destFolder = './app/js/',
    destFile = 'script.js';

gulp.task('browserify', () =>{
    return browserify(sourceFile)
        .bundle()
        .pipe(source(destFile))
        .pipe(gulp.dest(destFolder));
});

gulp.task('watch', () =>{
    var bundler = watchify(sourceFile);
    bundler.on('update', rebundle);
    function rebundle() {
        return bundler.bundle()
            .pipe(source(destFile))
            .pipe(gulp.dest(destFolder));
    }
    return rebundle();
});

gulp.task('favicon', () =>{
    gulp.src(['./dev/favicon/*.png','./dev/favicon/brouserconfig.xml'])
    .pipe(gulp.dest('./app/'));
});

gulp.task('images-copy',() =>{
    gulp.src('./dev/images/*')
    .pipe(imagemin())
    .pipe(gulp.dest('./app/images/'));
});

gulp.task('copyJS',() =>{
    gulp.src('./dev/js/*')
    .pipe(gulp.dest('./app/js/'));
});

gulp.task('views', () =>{
    return gulp.src('./dev/*.pug')
        .pipe(plumber())
        .pipe(plumberNotifier())
        .pipe(pug({
            // Your options in here.
            pretty:true
        }))
        .pipe(gulp.dest('./app/'));
});

gulp.task('sass', () =>{
    return gulp.src('./dev/sass/*.scss')
        .pipe(plumber())
        .pipe(plumberNotifier())
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest("./app/css/"));
});

gulp.task('watcher',() => {
    gulp.watch('./dev/*.pug',['views']);
    gulp.watch('./dev/include/*.pug',['views']);
    gulp.watch('./dev/sass/*.scss',['sass']);
});

gulp.task('webserver', function() {
    gulp.src('./app/')
        .pipe(server({
            livereload: true,
            directoryListing: false,
            open: true
        }));
});

gulp.task('default',['images-copy','copyJS','favicon','views','sass','watcher','browserify','webserver']);