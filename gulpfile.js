'use strict';

const gulp = require("gulp");
const sass = require("gulp-sass");
const concat = require("gulp-concat");
const gulpIf = require("gulp-if");
const sourcemaps = require("gulp-sourcemaps");
const autoprefixer = require("gulp-autoprefixer");
const browserSync = require("browser-sync").create();
const notify = require("gulp-notify");
const plumber = require("gulp-plumber");
const combiner = require("stream-combiner2").obj;
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');
const dirExists = require('directory-exists');

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

// преобразование sass в css с сжатием в продакшене
gulp.task('styles', function(){
    return gulp.src('scss/style.scss')
        .pipe(plumber({
            errorHandler: notify.onError(function(err){
                return {
                    title: 'STYLES',
                    message: err.message
                }
            })
        }))
        .pipe(gulpIf(isDevelopment, sourcemaps.init()))
        .pipe(autoprefixer())
        .pipe(sass())
        .pipe(gulpIf(isDevelopment, sourcemaps.write('.')))
        .pipe(gulpIf(!isDevelopment, combiner(
            cleanCSS(),
            concat('style.min.css')
        )))
        .pipe(gulp.dest('css'));
});


// сжатие js для продакшена
gulp.task('js', function(){
    return gulp.src(['js/*.js', '!js/*.min.js'])
        .pipe(uglify())
        // .pipe(concat('all.min.js'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('js'));
});


// создание копия исходных картинок в папке для бекапа
gulp.task('copy-source-images', function(callback){
    var imgSource = 'images';
    if( !dirExists.sync('./' + imgSource) ){
        return gulp.src('img/**/*.*')
            .pipe(gulp.dest(imgSource));
    }
    callback();
});


// сжатие изображения для продакшена
gulp.task('compress-img', function(){
    return gulp.src('img/**/*.{png,jpg,jpeg}')
        .pipe(imagemin())
        .pipe(gulp.dest('img'));
});


// отслеживание изменений в scss для перекомпиляции
gulp.task('watch', function(){
    gulp.watch('scss/**/*.*', gulp.series('styles'));
});


// автоматическая перезагрузка браузера при смене стилей или кода в html
gulp.task('serve', function(){
    browserSync.init({
        server: '.'
    });

    // browserSync.watch('./**/*.{css,html}').on('change', browserSync.reload);

    browserSync.watch('css/*.css').on('change', browserSync.reload);
    browserSync.watch('js/*.js').on('change', browserSync.reload);
    browserSync.watch('./*.html').on('change', browserSync.reload);
});


// сборка development
gulp.task('dev', gulp.series(
    'styles',
    gulp.parallel('watch', 'serve')
));


// сборка production
gulp.task('prod', gulp.series(
    'styles',
    'js',
    'copy-source-images',
    'compress-img'
));

