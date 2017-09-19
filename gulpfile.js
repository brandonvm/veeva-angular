// if you need to edit paths; it is best do so in the config.js file
var config = require("./config").config;
var fs = require('fs');
var path = require('path');
var gulp = require("gulp");
var gulpLoadPlugins = require('gulp-load-plugins');
var _$ = gulpLoadPlugins();
var tsProject = _$.typescript.createProject("tsconfig.json");
var del = require('del');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

gulp.task('plug', () => {
    console.log(_$);
});

/**
 *  Returns current folders in src folder
 */
const getFolders = () => {

    let folders = [];
    
    fs.readdirSync(config.sourceRoot).filter(function(file) {
        if(fs.statSync(path.join(config.sourceRoot, file)).isDirectory()) {
            folders.push(file);
        }
    });

    return folders;
}

/**
 * ZIP all the files to be uploaded on SalesForce
 */
gulp.task('zip', () => {
    let folders = [],
        folderName,
        i;
   
    // Getting folders already created
    folders = getFolders();

    for(i = 0; i < folders.length; i++) {
        // folderName = (folders[i] == 'shared') ? config.sharedName : folders[i];
        gulp.src(`${config.destinationPath}/${folders[i]}/**`)
            .pipe(_$.zip(`${folders[i]}.zip`))
            .pipe(gulp.dest(config.destinationPath));
    }
});

/**
 * Create the correct Veeva structure for new slides
 */
gulp.task('create', () => {    
    var slideName, 
        slideSrc,
        folders = [],
        isDuplicated,
        i;

    del('src/slide-test');

    // Getting folders
    folder = getFolders();

    // Taking slider name from param task
    for(i = 0; i < process.argv.length; i++) {
        if(process.argv[i] == "--slide") {
            slideName = process.argv[i + 1];
            isDuplicated = (folders.indexOf(slideName) == -1) ? false : true;
        }
    }

    /**
     * Checking if slide param was typed
     * Checking if slide name is not duplicated
    */
    if(!slideName) {
        console.log(`To create a new slide please use next task 'gulp create --slide name'`);
        return;
    } else if (isDuplicated) {
        console.log(`'${slideName}' is already is use, please use a different name`);
        return;
    }

    // Updating new slide src
    slideSrc = `${config.sourceRoot}${slideName}`; 

    // Creating folder structure for the new slide
    gulp.src(config.sourceRoot, {read: false})
        .pipe(_$.shell(`mkdir -p ${slideSrc}`));  
    
    // Copy and rename template files
    gulp.src(['template/**', '!template/*.jpg'])        
        .pipe(_$.if('index.html', _$.rename(`${slideName}.html`)))        
        .pipe(_$.stringReplace('slide-name', slideName))        
        .pipe(gulp.dest(`${slideSrc}`));    

    // Copy and rename thimb images
    gulp.src('template/*.jpg')
        .pipe(_$.if('*-full.jpg', _$.rename(`${slideName}-full.jpg`)))
        .pipe(_$.if('*-thumb.jpg', _$.rename(`${slideName}-thumb.jpg`)))
        .pipe(gulp.dest(`${slideSrc}`));
});

/**
 * Create local server
 */
gulp.task('browserSync', () => {
    browserSync.init({
        server: {
            index: "index.html",
            baseDir: ['build/']
        }
    });
});

/**
 * Create local server
 */
gulp.task('browserSyncBuild', () => {
    browserSync.init({
        server: {
            index: "index.html",
            baseDir: ['build/']
        }
    });
});

/**
 * Lint .ts files before to be transpiled
 */
gulp.task('tslint', () => {
    return gulp.src(config.typeScriptSource)
        .pipe(_$.tslint({
            formatter: 'prose'
        }))
        .pipe(_$.tslint.report());
});

/**
 * Build .ts files
 */
gulp.task("tsbuild", ['tslint'], () => {
    var tsResult = gulp.src(config.typeScriptSource)
        .pipe(_$.if(config.devMode, _$.sourcemaps.init()))
        .pipe(tsProject());
    return tsResult.js
        .pipe(_$.if(config.devMode, _$.sourcemaps.write(config.mapPath)))
        .pipe(gulp.dest(config.destinationPath))
        .pipe(reload({stream: true}));
});

/**
 * Copy html files
 */
gulp.task('html', () => {
    return gulp.src(config.htmlSource)
        .pipe(gulp.dest(config.destinationPath))
        .pipe(reload({stream: true}));
});

/**
 * Copy js files
 */
gulp.task('js', () => {
    return gulp.src(config.jsSource)
        .pipe(gulp.dest(config.destinationPath))
        .pipe(reload({stream: true}));
});

/**
 * Prod js files
 */
gulp.task('js:prod', () => {
    return gulp.src(config.jsSource)
        .pipe(gulp.dest(config.destinationPath))
        .pipe(reload({stream: true}));
});

/**
 * Copy scss files
 */
gulp.task('styles', () => {
    return gulp.src(config.scssSource)
        .pipe(_$.sass())
        .pipe(_$.autoprefixer({browsers: ['last 4 versions']}))
        .pipe(_$.plumber({ errorHandler: function(e) {console.log(e); }}))
        .pipe(gulp.dest(config.destinationPath))
        .pipe(reload({stream: true}));
});

/**
 * Copy Vendors libraries used by angular and others
 */
gulp.task('libs', () => {
    gulp.src(config.vendorsLibraries, {cwd: config.nodeModulesSource})
        .pipe(gulp.dest(config.vendorsDestinationPath));
});

/**
 * Copy Assets
 */
gulp.task('assets', () => {
    return gulp.src(config.assetsSource)
        .pipe(gulp.dest(config.destinationPath))
        .pipe(reload({stream: true}));
});

/**
 * Create Index File
 */
gulp.task('index', () => {
    let folders = getFolders(), dom = '', slide, i; 

    // Building HTML code
    for(i = 0; i < folders.length; i++) {        
        if(folders[i] != 'shared') {
            slide = `<li><a href="${folders[i]}/${folders[i]}.html">${folders[i]}</a></li>`,
            dom += slide;
        }        
    }    

    // Appending HTML built
    return gulp.src(`${config.sourceRoot}index.html`)
        .pipe(_$.dom(function() {
            this.getElementById('slides-list').innerHTML = dom;
            return this;
        }))
        .pipe(_$.stringReplace('presentation-name', config.presentationName))     
        .pipe(gulp.dest(config.destinationPath));
});


/**
 * CLean build folder
 */
gulp.task('clean', () => {
    return del(config.deletePath);
});

/**
 * Watch for changes
 */
gulp.task('watch', () => {
    gulp.watch(config.typeScriptSource,['tsbuild']);
    gulp.watch(config.htmlSource,['tsbuild', 'html']);
    gulp.watch(config.jsSource,['js']);
    gulp.watch(config.scssSource,['styles']);
    gulp.watch(config.assetsSource,['assets']);
});

/**
 * Minify all files (js, css, html)
 */
gulp.task('build:prod', () => {
    return gulp.src(config.buildSource)      
      .pipe(_$.if('*.js', _$.uglify()))
      .pipe(_$.if('*.css', _$.cssnano()))
      .pipe(_$.if('*.html', _$.htmlmin({collapseWhitespace: true})))
      .pipe(gulp.dest(config.destinationPath));
});

/**
 * Minify all images
 */
gulp.task('imagemin', () => {
    return gulp.src(config.imgBuildSource)
      .pipe(_$.imagemin())
      .pipe(gulp.dest(config.destinationPath));
});

/**
 * Build the project to production
 */
gulp.task('build', ['clean'], (cb) => {
    config.devMode = false;
    runSequence(
        ['tsbuild', 'html', 'js', 'styles', 'assets', 'libs'],
        ['build:prod', 'imagemin'],
        ['zip', 'browserSyncBuild'],
        cb);
});

/**
 * Serve the project
 */
gulp.task('serve', (cb) => {
    config.devMode = true;
    runSequence(
        ['tsbuild', 'html', 'js', 'styles', 'assets', 'libs'],
        ['index'],
        ['browserSync', 'watch'], 
        cb);
});


