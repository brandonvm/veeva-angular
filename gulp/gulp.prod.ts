import {Gulpclass, Task} from "gulpclass/Decorators";

let gulp = require("gulp"),
    fs = require('fs'),
    path = require('path'),
    config = require("./config").config,
    gulpLoadPlugins = require('gulp-load-plugins'),
    _$ = gulpLoadPlugins(),
    tsProject = _$.typescript.createProject("./tsconfig.json");

@Gulpclass()
export class GulpProd {

    getFolders = () => {        
        let folders:any = [];
        
        fs.readdirSync(config.sourceRoot).filter((file:string) => {
            if(fs.statSync(path.join(config.sourceRoot, file)).isDirectory()) {
                folders.push(file);
            }
        });
    
        return folders;
    }

    /**
     * Lint .ts files before to be transpiled
     */
    @Task()
    tsLintProd() {
        return gulp.src(config.typeScriptTmp)
            .pipe(_$.tslint({
                formatter: 'prose'
            }))
            .pipe(_$.tslint.report());
    }

    /**
     *  Build .ts files
     */
    @Task("tsBuildProd", ['tsLint'])
    tsBuildProd() {
        let tsResult = gulp.src(config.typeScriptTmp)
        .pipe(_$.if(config.devMode, _$.sourcemaps.init()))
        .pipe(tsProject());

        return tsResult.js
            .pipe(_$.if(config.devMode, _$.sourcemaps.write(config.mapPath)))
            .pipe(gulp.dest(config.destinationPath));
    }

    /**
     *  Copy html files
     */
    @Task()
    htmlProd() {
        return gulp.src(config.htmlTmp)
            .pipe(gulp.dest(config.destinationPath));
    }

    /**
     *  Copy js files
     */
    @Task()
    jsProd() {
        return gulp.src(config.jsTmp)
            .pipe(gulp.dest(config.destinationPath));
    }

    /**
     *  Compile sccs to css
     */
    @Task()
    stylesProd() {
        return gulp.src(config.scssTmp)
            .pipe(_$.sass())
            .pipe(_$.autoprefixer({browsers: ['last 4 versions']}))
            .pipe(_$.plumber({ errorHandler: (e:any) => {console.log(e); }}))
            .pipe(gulp.dest(config.destinationPath));
    }

    /**
     * Copy Vendors libraries used by angular and others
     */
    @Task()
    libsProd() {
        return gulp.src(config.vendorsLibraries, {cwd: config.nodeModulesSource})
            .pipe(gulp.dest(config.vendorsDestinationPath));
    }

    /**
     * Copy Assets
     */
    @Task()
    assetsProd() {
        return gulp.src(config.assetsTmp)
            .pipe(gulp.dest(config.destinationPath));
    }

    /**
     * Minify all files (js, css, html)
     */
    @Task()
    buildProd() {
        return gulp.src(config.buildSource)      
            .pipe(_$.if('*.js', _$.uglify()))
            .pipe(_$.if('*.css', _$.cssnano()))
            .pipe(_$.if('*.html', _$.htmlmin({collapseWhitespace: true})))
            .pipe(gulp.dest(config.destinationPath));
    }

    /**
     * Minify all images
     */
    @Task()
    imagemin() {
        return gulp.src(config.imgBuildSource)
            .pipe(_$.imagemin())
            .pipe(gulp.dest(config.destinationPath));
    }

    /**
     * ZIP all the files to be uploaded on SalesForce
     */
    @Task()
    zip() {
        let folders = [],
        folderName,
        i;
   
        // Getting folders already created
        folders = this.getFolders();

        for(i = 0; i < folders.length; i++) {
            // folderName = (folders[i] == 'shared') ? config.sharedName : folders[i];
            gulp.src(`${config.destinationPath}/${folders[i]}/**`)
                .pipe(_$.zip(`${folders[i]}.zip`))
                .pipe(gulp.dest(config.destinationPath));
        }
    }
    
}