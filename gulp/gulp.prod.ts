import {Gulpclass, Task} from "gulpclass/Decorators";

let gulp = require("gulp"),
    fs = require('fs'),
    path = require('path'),
    config = require("./config").config,
    gulpLoadPlugins = require('gulp-load-plugins'),
    _$ = gulpLoadPlugins();

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