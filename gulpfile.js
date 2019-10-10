/*
  gulpプラグインの読み込み
---------------------------------------------*/
const gulp = require('gulp');
const sass = require('gulp-sass');
const pug = require("gulp-pug");
const csscomb = require('gulp-csscomb');
const autoprefixer = require("gulp-autoprefixer");
const mmq = require('gulp-merge-media-queries');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const cssmin = require('gulp-cssmin');
const connect = require('gulp-connect-php');
const browser = require("browser-sync");


/*
  ディレクトリの設定
---------------------------------------------*/
const paths = {
  srcDir: '.',
  dstDir: '.',
  assetDir: '/assets'
};


/*
  Webサーバー起動
---------------------------------------------*/
gulp.task('server', function () {
  connect.server({
    base: paths.srcDir,
    bin: '/Applications/MAMP/bin/php/php7.2.10/bin/php',
    ini: '/Applications/MAMP/bin/php/php7.2.10/conf/php.ini'
  }, function () {
    browser({
      proxy: '127.0.0.1:8000'
    });
  });
});


/*
  Pug
---------------------------------------------*/
gulp.task("pug", function () {
  return (
    gulp.
      src(
        [paths.srcDir + '/pug/**/*.pug', '!' + paths.srcDir + '/pug/**/_*.pug']
      )
      .pipe(pug({
        pretty: true
      }))
      .pipe(gulp.dest(paths.srcDir))
      .pipe(notify({
        title: 'Pugの処理完了',
        message: new Date(),
      }))
  );
});

/*
  Sass
---------------------------------------------*/
gulp.task("sass", function () {
  return gulp.src(paths.srcDir + paths.assetDir + '/_sass/**/*.scss')
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(sass({
      outputStyle: 'expanded'
    }))
    .pipe(mmq({
      log: true
    }))
    .pipe(csscomb())
    .pipe(autoprefixer({
      browsers: ['last 2 version']
    }))
    .pipe(cssmin())
    .pipe(gulp.dest(paths.srcDir + paths.assetDir + '/css'))
    .pipe(browser.reload({
      stream: true
    }))
    .pipe(notify({
      title: 'Sassをコンパイルしました',
      message: new Date(),
    }));
});

/*
  reload
---------------------------------------------*/
gulp.task('reload', function (done) {
  browser.reload();
  done();
});


/*
  Watch
---------------------------------------------*/
gulp.task('default', gulp.parallel('server', function () {
  gulp.watch(paths.srcDir + '/**/*.js', gulp.task('reload'));
  gulp.watch(paths.srcDir + '/**/*.scss', gulp.task('sass'));
  gulp.watch(paths.srcDir + '/**/*.pug', gulp.task('pug'));
  gulp.watch(paths.srcDir + '/**/*.html', gulp.task('reload'));
}));
