const gulp = require('gulp'),
    tsc = require('gulp-typescript'),
    peg = require('gulp-peg'),
    merge = require('merge2'),
    rename = require('gulp-rename'),
    gulpIgnore = require('gulp-ignore'),
    bump = require('gulp-bump'),
    concat = require('gulp-concat'),
    streamqueue = require('streamqueue');


const grammars = [
    'index', 'tags', 'expression', 'binary-operation',
    'literals', 'math', 'context', 'function-call',
    'template', 'type', 'common'
];


gulp.task('typescript', () => {
    const project = tsc.createProject('tsconfig.json', {
        declaration: true
    });

    var tsResult = gulp.src(['src/**/*.ts'])
        .pipe(project());

    return merge([ // Merge the two output streams, so this task is finished when the IO of both operations is done. 
        tsResult.dts.pipe(gulp.dest('lib')),
        tsResult.js
        .pipe(gulpIgnore.exclude('**/template_parser.js')).pipe(gulp.dest('lib'))
    ]);
});

gulp.task('build:test', () => {
    /*const project = tsc.createProject('tsconfig.json', {
        declaration: true
    });*/

    var tsResult = gulp.src(['test/**/*.ts'])
        .pipe(tsc({
            target: 'es6',
            module: 'commonjs'
        }));

    return merge([ // Merge the two output streams, so this task is finished when the IO of both operations is done. 
        tsResult.dts.pipe(gulp.dest('lib')),
        tsResult.js
        .pipe(gulp.dest('test'))
    ]);
})

gulp.task('bundle', () => {
    const files = grammars.map(m => gulp.src(`grammar/${m}.pegjs`))
    return streamqueue({
            objectMode: true
        }, ...files)
        .pipe(concat('template_bundle.pegjs'))
        .pipe(gulp.dest('./grammar'))
})

gulp.task('grammar', () => {

    const files = grammars.map(m => gulp.src(`grammar/${m}.pegjs`))
    return streamqueue({
            objectMode: true
        }, ...files)
        .pipe(concat('template_parser.js'))
        .pipe(peg())
        .pipe(gulp.dest('./lib'));



    /*return merge([
        gulp.src('./grammar/template.pegjs')
        .pipe(peg())
        .pipe(rename("template_parser.js"))
        .pipe(gulp.dest('lib'))

    ])*/
});

gulp.task('bump', () => {
    gulp.src('package.json')
        .pipe(bump())
        .pipe(gulp.dest('./'))
})

gulp.task('build', ['grammar', 'typescript']);

gulp.task('watch', () => {
    gulp.watch(['src/**/*.ts'], ['typescript']);
    gulp.watch(['test/src/**/*.ts'], ['build:test']);
    gulp.watch(['grammar/*.pegjs'], ['grammar'])
    gulp.watch(['test/*.ts'], ['build:test']);
})


gulp.task('default', ['build', 'build:test'])