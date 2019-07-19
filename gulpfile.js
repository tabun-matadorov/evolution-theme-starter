const gulp = require('gulp');
const sass = require('gulp-sass');
const del = require('del');
const zip = require('gulp-zip');
const gap = require('gulp-append-prepend');
const svgSprite = require('gulp-svg-sprite');
const postcss = require('gulp-postcss');
const file = require('gulp-file');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const pkg = require('./package.json');
const validate = require('./validate');
const { serve, reload } = require('./server');

function buildSprite(folder, done) {
    gulp.src(`src/${folder}/**/*.svg`)
        .pipe(svgSprite({
            mode: {
                stack: {
                    dest: '.',
                    sprite: `${folder}.svg`,
                },
                css: false,
                view: false,
                defs: false,
                symbol: false,
            },
        }))
        .pipe(gulp.dest('dist'))
        .on('end', done);
}

const remove = del.sync;

function icons(done) {
    remove(['dist/icons.svg']);
    buildSprite('icons', done);
}

function images(done) {
    remove(['dist/images.svg']);
    buildSprite('images', done);
}

function clean(done) {
    remove(['dist']);
    done();
}

function colors(done) {
    gulp.src('src/colors.json', { allowEmpty: true })
        .pipe(validate('colors'))
        .pipe(gulp.dest('dist'))
        .on('end', done);
}

function menu(done) {
    gulp.src('src/menu/{admin,reseller,user}.json', { allowEmpty: true })
        .pipe(validate('menu'))
        .pipe(gulp.dest('dist/menu'))
        .on('end', done);
}

function watch() {
    gulp.watch('src/styles/*.scss', gulp.series(css, reload));
    gulp.watch('src/icons/**/*.svg', gulp.series(icons, reload));
    gulp.watch('src/images/**/*.svg', gulp.series(images, reload));
    gulp.watch('src/colors.json', gulp.series(colors, reload));
    gulp.watch('src/menu/{admin,reseller,user}.json', gulp.series(menu, reload));
};


function css(done) {
    gulp
        .src('src/styles/{standard,sidebar,grid,hybrid}.scss')
        .pipe(gap.prependText('@import "helpers";'))
        .pipe(sass())
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(gulp.dest('dist/layout'))
        .on('end', done);
};

function archive(done) {
    gulp
        .src('dist/**/*')
        .pipe(zip(`${pkg.name}.zip`))
        .pipe(gulp.dest('./'))
        .on('end', done);
}

function themeData(done) {
    const data = JSON.stringify({
        name: pkg.description,
        author: pkg.author,
        version: pkg.version,
    }, null, 2);
    file('theme.json', data, { src: true })
        .pipe(gulp.dest('dist'))
        .on('end', done);
}

const dev = gulp.series(
    clean,
    css,
    icons,
    images,
    colors,
    menu,
    serve,
    watch
);

const build = gulp.series(
    clean,
    gulp.parallel(css,
        icons,
        images,
        colors,
        menu,
    ),
    themeData,
    archive,
);

exports.dev = dev;
exports.build = build;