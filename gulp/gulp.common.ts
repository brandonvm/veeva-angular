/**
 * Common Gulp tasks (DEV & PROD)
 */
import {Gulpclass, Task} from "gulpclass/Decorators";

let gulp = require("gulp"),
    del = require('del'),
    config = require("./config").config,    
    gulpLoadPlugins = require('gulp-load-plugins'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    _$ = gulpLoadPlugins(),
    tsProject = _$.typescript.createProject("./tsconfig.json");

@Gulpclass()
export class GulpCommon {

    /**
     * Clean build folder
     */
    @Task()
    clean() {
        return del(config.deletePath);
    }

    /**
     * Lint .ts files before to be transpiled
     */
    @Task()
    tsLint() {
        return gulp.src(config.typeScriptSource)
            .pipe(_$.tslint({
                formatter: 'prose'
            }))
            .pipe(_$.tslint.report());
    }

    /**
     *  Build .ts files
     */
    @Task("tsBuild", ['tsLint'])
    tsBuild() {
        let tsResult = gulp.src(config.typeScriptSource)
        .pipe(_$.if(config.devMode, _$.sourcemaps.init()))
        .pipe(tsProject());

        return tsResult.js
            .pipe(_$.if(config.devMode, _$.sourcemaps.write(config.mapPath)))
            .pipe(gulp.dest(config.destinationPath))
            .pipe(reload({stream: true}));
    }

    /**
     *  Copy html files
     */
    @Task()
    html() {
        return gulp.src(config.htmlSource)
            .pipe(gulp.dest(config.destinationPath))
            .pipe(reload({stream: true}));
    }

    /**
     *  Copy js files
     */
    @Task()
    js() {
        return gulp.src(config.jsSource)
            .pipe(gulp.dest(config.destinationPath))
            .pipe(reload({stream: true}));
    }

    /**
     *  Compile sccs to css
     */
    @Task()
    styles() {
        return gulp.src(config.scssSource)
            .pipe(_$.sass())
            .pipe(_$.autoprefixer({browsers: ['last 4 versions']}))
            .pipe(_$.plumber({ errorHandler: (e:any) => {console.log(e); }}))
            .pipe(gulp.dest(config.destinationPath))
            .pipe(reload({stream: true}));
    }

    /**
     * Copy Vendors libraries used by angular and others
     */
    @Task()
    libs() {
        return gulp.src(config.vendorsLibraries, {cwd: config.nodeModulesSource})
            .pipe(gulp.dest(config.vendorsDestinationPath));
    }

    /**
     * Copy Assets
     */
    @Task()
    assets() {
        return gulp.src(config.assetsSource)
            .pipe(gulp.dest(config.destinationPath))
            .pipe(reload({stream: true}));
    }

}