import {Gulpclass, Task, SequenceTask} from "gulpclass/Decorators";

let gulp = require("gulp"),
    fs = require('fs'),
    del = require('del'),
    path = require('path'),
    config = require("./config").config,
    gulpLoadPlugins = require('gulp-load-plugins'),
    _$ = gulpLoadPlugins();

@Gulpclass()
export class GulpAot {

    getSharedFolders = () => {        
        let folders:any = [];
        
        fs.readdirSync(".tmp/shared/js/module/").filter((file:string) => {
            if(fs.statSync(path.join(".tmp/shared/js/module/", file)).isDirectory()) {
                folders.push(file);
            }
        });
    
        return folders;
    }

    getSlidesFolders = () => {        
        let folders:any = [];
        
        fs.readdirSync(".tmp/").filter((file:string) => {
            if(fs.statSync(path.join(".tmp/", file)).isDirectory() && file !== 'shared') {
                folders.push(file);
            }
        });
    
        return folders;
    }

    @Task()
    cleanAot() {
        return del(['.tmp', 'aot']);
    }

    // Move all src files to a .tmp folder
    @Task()
    copySrc() {        
        return gulp.src(["src/**", "!src/index.html"])
            .pipe(gulp.dest('.tmp'));
    }
    
    @Task()
    componentReplace() {
        return gulp.src('.tmp/**/app/*.component.ts')
            .pipe(_$.stringReplace('./app/', ''))
            .pipe(gulp.dest('.tmp'));
    }

    @Task()
    sharedReplace() {
        let folders = this.getSharedFolders();
        
        for(let i = 0; i < folders.length; i ++) {
            if(i === (folders.length - 1)) {
                return gulp.src(`.tmp/shared/js/module/${folders[i]}/${folders[i]}.component.ts`)
                    .pipe(_$.stringReplace(`/shared/js/module/${folders[i]}/`, ''))
                    .pipe(gulp.dest(`.tmp/shared/js/module/${folders[i]}/`));    
            } else {
                gulp.src(`.tmp/shared/js/module/${folders[i]}/${folders[i]}.component.ts`)
                    .pipe(_$.stringReplace(`/shared/js/module/${folders[i]}/`, ''))
                    .pipe(gulp.dest(`.tmp/shared/js/module/${folders[i]}/`));
            }
        }
    }

    @Task()
    createFilesAot() {
        return gulp.src(config.sourceRoot, {read: false})
            .pipe(_$.shell(`node_modules/.bin/ngc -p tsconfig-aot.json`));  
    }

    @Task()
    removeCompiledFiles() {
        return del(['.tmp/**/*.js', '!.tmp/**/systemjs.config.js']);
    }

    @Task()
    moveSlideAot() {
        return gulp.src('aot/.tmp/**/app/*')
            .pipe(_$.stringReplace('../../.tmp/', ""))
            .pipe(gulp.dest(`.tmp`));
    }

    @Task()
    moveSharedAot() {
        return gulp.src(['aot/.tmp/shared/js/module/**/*', 'aot/.tmp/shared/js/module/*'])
            .pipe(_$.stringReplace('../../.tmp/', ""))
            .pipe(gulp.dest(`.tmp/shared/js/module`));
    }

    @Task()
    deleteJitMain() {
        return del('.tmp/**/main.ts');
    }

    @Task()
    deleteAotMain() {
        return del('.tmp/**/main.aot.ts');
    }

    @Task()
    renameAotMain() {

        let folders = this.getSlidesFolders();
        
        for(let i = 0; i < folders.length; i ++) {
            if(i === (folders.length - 1)) {
                return gulp.src(`.tmp/${folders[i]}/app/main.aot.ts`)
                    .pipe(_$.rename('main.ts'))
                    .pipe(gulp.dest(`.tmp/${folders[i]}/app/`)); 
            } else {
                gulp.src(`.tmp/${folders[i]}/app/main.aot.ts`)
                    .pipe(_$.rename('main.ts'))
                    .pipe(gulp.dest(`.tmp/${folders[i]}/app/`)); 
            }
        }
    }

    @SequenceTask()
    aot() {
        return [
            'cleanAot', 'copySrc',
            ['componentReplace', 'sharedReplace'],
            'createFilesAot', 'removeCompiledFiles',
            ['moveSlideAot', 'moveSharedAot'],
            'deleteJitMain', 'renameAotMain', 'deleteAotMain'
        ];
    }
    
}