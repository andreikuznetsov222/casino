'use strict';

var gulp = require('gulp'),
    postcss = require('gulp-postcss'),
    sourcemaps = require('gulp-sourcemaps'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    watch = require('gulp-watch'),
    imagemin = require('gulp-imagemin'),
    spritesmith = require('gulp.spritesmith'),
    cssnext = require("postcss-cssnext"),
    plumber = require('gulp-plumber'),
    precss = require('precss'),
    flexbugs = require('postcss-flexbugs-fixes'),
    rucksack = require('rucksack-css'),
    initialprop = require('postcss-initial'),
    rigger = require('gulp-rigger'),
    cssnano = require('gulp-cssnano'),
    svgSprite = require('gulp-svg-sprite'),
    changed = require('gulp-changed'),
    argv = require('yargs').argv,
    gulpif = require('gulp-if'),
    del = require('del'),
    vinylPaths = require('vinyl-paths'),
    urlAdjuster = require('gulp-css-url-adjuster'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglifyjs');

gulp.task('serve', function () {
    browserSync({
        server: {
            baseDir: ['dist'],
            directory: true
        }
    });

    gulp.watch(['./js/**/*.js'], {cwd: 'dist'}, reload);
    gulp.watch(['src/**/*.css'], gulp.series('style'));
    gulp.watch(['src/**/*.html'], gulp.series('template'));
});


gulp.task('sprite', function () {
    var spriteData = gulp.src('src/images/sprite/*.png').pipe(spritesmith({
        imgName: 'sprite.png',
        cssName: '_sprite.css',
        padding: 0,
        cssTemplate: 'mustacheSprite.css.mustache',
        sourcemap: true
    }));

    spriteData.img
        // .pipe(imagemin())
        .pipe(gulp.dest('dist/images/sprite'));

    spriteData.css
        // .pipe(csso())
        .pipe(gulp.dest('src/css/parts'));
});

gulp.task('style', function () {
    var processors = [
        precss,
        rucksack,
        cssnext({
            features: {
                autoprefixer: {
                    browsers: ['last 7 version']
                },
                sourcemap: true,
                rem: false
            }
        }),

        flexbugs,
        initialprop
    ];

    return gulp.src('src/css/*.css')
        .pipe(plumber())
        .pipe(gulpif(!argv.prod, sourcemaps.init()))
        .pipe(postcss(processors))
        .pipe(gulpif(argv.prod, cssnano({
            reduceIdents: false,
            zindex: false
        })))
        .pipe(gulpif(!argv.prod, sourcemaps.write('.')))
        .pipe(gulp.dest('dist/css'))
        .pipe(reload({stream: true}));
});

gulp.task('fonts', () => {
    return gulp.src('src/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'));
});

gulp.task('images', () => {
    return gulp.src('src/images/**/*')
        .pipe(gulp.dest('dist/images'));
});

gulp.task('js', () => {
    return gulp.src('src/js/*')
        .pipe(gulp.dest('dist/js'));
});

gulp.task('libs', function () {
    return gulp.src('src/js/libs/*')
        .pipe(concat('libs.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('src/js'));
});

gulp.task('delete', function () {
    del(['dist/js/libs', 'dist/parts']);
});

gulp.task('template', function () {
    return gulp.src('src/**/*.html')
        .pipe(rigger())
        .pipe(changed('dist', {hasChanged: changed.compareContents}))
        .pipe(gulp.dest('dist'))
        .pipe(reload({stream: true}));
});


/***********svg sprite as symbol**************/
gulp.task('svgspr', function () {
    let config;
    config = {
        "dest": "dist/images/svg",
        "shape": {
            "spacing": {
                "padding": 0
            }
        },
        "mode": {
            "symbol": {
                "render": {
                    "css": {
                        "dest": "../../../../src/css/parts/_svg-symbol-sprite.css"
                    }
                }
            }
        },
    };
    return gulp.src('src/images/svg/*.svg')
        .pipe(svgSprite(config))
        .pipe(gulp.dest('dist/images/svg/'));
});


/***********svg sprite as background**************/
/**dont call this task alone, call css-svgready**/
gulp.task('css-svgspr', function () {
    let config;
    config = {
        "dest": "dist/images",
        "shape": {
            "spacing": {
                "padding": 0
            }
        },
        includeDimensions: true,
        "mode": {
            "css": {
                "dest": ".",
                "prefix": ".",
                "dimensions": " ",
                "sprite": "images/svg-css-sprite.svg",
                "render": {
                    "css": {
                        "dest": "css/parts/_svg-css-sprite.css"
                    }
                }
            }
        }
    };

    return gulp.src('src/images/svgcss/*.svg')
        .pipe(svgSprite(config))
        .pipe(gulp.dest('src'));
});

gulp.task('css-svgsprmove', function () {
    //del prevous sprite in src
    del('dist/images/svgcss/*.svg');

    //copy from src to src folder
    return gulp.src('src/images/*.svg')
        .pipe(vinylPaths(del))
        .pipe(gulp.dest('dist/images/svgcss'));
});

gulp.task('css-imageurlrebase', function () {
    return gulp.src('src/css/parts/_svg-css-sprite.css')
        .pipe(urlAdjuster({
            replace: ['../../images', '../images/svgcss']
        }))
        .pipe(gulp.dest(function (file) {//to the same dest as src
            return file.base;
        }));
});

gulp.task('css-svgready', gulp.series('css-svgspr', 'css-svgsprmove', 'css-imageurlrebase'));

gulp.task('default', gulp.series('style', 'template', 'fonts', 'images', 'js', 'serve'));

