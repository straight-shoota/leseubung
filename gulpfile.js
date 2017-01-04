var gulp = require('gulp');
var sass = require('gulp-sass');
var coffee = require('gulp-coffee');
var rename = require('gulp-rename');
var inlinesource = require('gulp-inline-source');
var browserSync = require('browser-sync').create();
var reload      = browserSync.reload;

src = {
  html: 'app/*.html',
  scss: 'app/scss/**/*.scss',
  coffee: 'app/coffeescript/*.coffee'
}

gulp.task('sass', function() {
  return gulp.src(src.scss, { sourcemaps: true })
    .pipe(sass())
    .pipe(gulp.dest('build/app/styles/'))
    .pipe(reload({ stream:true }));
});

gulp.task('coffee', function() {
  gulp.src('app/coffeescript/*.coffee', { sourcemaps: true })
    .pipe(coffee({bare: true}))
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

gulp.task('inlinesource', ['app'], function() {
  return gulp.src('build/app/index.html')
      .pipe(inlinesource({
        rootpath: 'build/app/'
      }))
      .pipe(gulp.dest('build/standalone'));
});

gulp.task('build', ['app', 'inlinesource']);

gulp.task('default', ['serve']);

gulp.task('deploy', ['build'], function(){
  gulp.src('**/*', { base: 'build/app/' })
    .pipe(gulp.dest('../leseübung-gh-pages/app/'))

  gulp.src('build/standalone/index.html')
    .pipe(rename('standalone.html'))
    .pipe(gulp.dest('../leseübung-gh-pages/'))
});
