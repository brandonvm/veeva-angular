import {Gulpclass, Task} from "gulpclass/Decorators";

let gulp = require("gulp"),
    fs = require('fs'),
    path = require('path'),
    config = require("./config").config,
    gulpLoadPlugins = require('gulp-load-plugins'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    _$ = gulpLoadPlugins();

@Gulpclass()
export class GulpDev {

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
     * Create local server
     */
    @Task()
    browserSync() {
        browserSync.init({
            server: {
                index: "index.html",
                baseDir: ['build/']
            }
        });
    }

    /**
     * Create Index File
     */
    @Task()
    index() {
        let folders = this.getFolders(), 
            dom = '', 
            slide, i; 
        
        // Building HTML code
        for(i = 0; i < folders.length; i++) {        
            if(folders[i] !== 'shared') {
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
    }

}