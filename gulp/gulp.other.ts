import {Gulpclass, Task} from "gulpclass/Decorators";

let gulp = require("gulp"),
    fs = require('fs'),
    path = require('path'),
    config = require("./config").config,
    gulpLoadPlugins = require('gulp-load-plugins'),
    _$ = gulpLoadPlugins();

@Gulpclass()
export class GulpOther {

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
     * Create the correct Veeva structure for new slides
     */
    @Task()
    create() {
        let slideName, 
            slideSrc,
            folders:any = [],
            isDuplicated,
            i;

        // Getting folders
        folders = this.getFolders();

        // Taking slider name from param task
        for(i = 0; i < process.argv.length; i++) {
            if(process.argv[i] === "--slide") {
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
    }

}