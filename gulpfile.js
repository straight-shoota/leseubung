var gulp = require('gulp');
var sass = require('gulp-sass');
var coffee = require('gulp-coffee');
var rename = require('gulp-rename');
var concat  = require('gulp-concat');
var inlinesource = require('gulp-inline-source');
var browserSync = require('browser-sync').create();
var reload      = browserSync.reload;
var deployDest = '../leseübung-gh-pages';
var exec = require('child_process').exec;

var src = {
  html: 'app/*.html',
  scss: 'app/scss/**/*.scss',
  coffee: 'app/coffeescript/**/*.coffee'
}

gulp.task('sass', function() {
  return gulp.src(src.scss, { sourcemaps: true })
    .pipe(sass())
    .pipe(gulp.dest('build/app/styles/'))
    .pipe(reload({ stream:true }));
});

gulp.task('coffee', function() {
  gulp.src('app/coffeescript/**/*.coffee', { sourcemaps: true })
    .pipe(coffee({bare: true}))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('build/app/scripts/'))
    .pipe(reload({ stream:true }));
});

gulp.task('vendor', function() {
  gulp.src('vendor/scripts/*')
    .pipe(gulp.dest('build/app/scripts/vendor'))
});

gulp.task('html', function(){
  gulp.src(src.html)
    .pipe(gulp.dest('build/app/'))
});

// watch files for changes and reload
gulp.task('serve', ['html', 'assets'], function() {
  browserSync.init({
    server: {
      baseDir: 'build/app/'
    }
  });

  // watch Sass files for changes, run the Sass preprocessor with the 'sass' task and reload
  gulp.watch(src.scss, ['sass']);
  gulp.watch(src.coffee, ['coffee']);
  gulp.watch(src.html, ['html']).on('change', reload)
});

gulp.task('assets', ['vendor', 'coffee', 'sass']);
gulp.task('app', ['html', 'assets']);

gulp.task('standalone', ['app'], function() {
  gulp.src('build/app/index.html')
      .pipe(inlinesource({
        rootpath: 'build/app/'
      }))
      .pipe(rename('standalone.html'))
      .pipe(gulp.dest('build/'));
  gulp.src('build/app/index.en.html')
      .pipe(inlinesource({
        rootpath: 'build/app/'
      }))
      .pipe(rename('standalone.en.html'))
      .pipe(gulp.dest('build/'));
});

gulp.task('build', ['app', 'standalone']);

gulp.task('default', ['serve']);

gulp.task('deploy', ['build'], function(){
  gulp.src('build/**/*', { base: 'build/' })
    .pipe(gulp.dest(deployDest))

  gulp.src('README.md')
    .pipe(rename('index.md'))
    .pipe(gulp.dest(deployDest))

  gulp.src('doc/**/*')
    .pipe(gulp.dest(deployDest + "/doc"))
});

gulp.task('test', [], function(cb){
  exec("coffee -r '../app/coffeescript/lib/normalize_bar_string.coffee' test/normalizer_test.coffee", function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});
