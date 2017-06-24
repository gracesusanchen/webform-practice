const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const browserify = require('browserify');
const watchify = require('watchify');
const babel = require('babelify');

function compile(watch) {
  const bundler = watchify(browserify('./src/index.js', { debug: true }).transform(babel));

  function rebundle() {
    bundler.bundle()
      .on('error', (err) => { console.error(err); this.emit('end'); })
      .pipe(source('build.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./build'));
  }

  if (watch) {
    bundler.on('update', () => {
      console.log('-> bundling...');
      rebundle();
    });
  }

  rebundle();
}

gulp.task('build', () => compile());
gulp.task('watch', () => compile(true));

gulp.task('default', ['watch']);
