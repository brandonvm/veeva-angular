import {Gulpclass, Task, SequenceTask} from "gulpclass/Decorators";

let gulp = require("gulp"),
    config = require("./config").config;

@Gulpclass()
export class Gulpfile {

    /**
     * Build the project to production
     */
    @SequenceTask()
    build() {
        config.devMode = false;
        return [
                'clean', 
                ['tsBuild', 'html', 'js', 'styles', 'assets', 'libs'], 
                ['buildProd', 'imagemin'], 
                'zip'
        ];
    }

    /**
     * Serve the project to production
     */
    @SequenceTask()
    serve() {
        config.devMode = true;
        return [
                'clean', 
                ['tsBuild', 'html', 'js', 'styles', 'assets', 'libs'], 
                'index', 
                ['browserSync', 'watch']
        ];
    }

}