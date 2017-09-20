import {Gulpclass, Task, SequenceTask} from "gulpclass/Decorators";

let gulp = require("gulp"),
    config = require("./config").config;

@Gulpclass()
export class Gulpfile {

    /**
     * Watch for changes
     */
    @Task()
    watch() {
        gulp.watch(config.typeScriptSource,['tsBuild']);
        gulp.watch(config.htmlSource,['tsBuild', 'html']);
        gulp.watch(config.jsSource,['js']);
        gulp.watch(config.scssSource,['styles']);
        gulp.watch(config.assetsSource,['assets']);
    }

    /**
     * Build the project to production
     */
    @SequenceTask()
    build() {
        config.devMode = false;
        return [
                ['clean', 'aot'],
                ['tsBuildProd', 'htmlProd', 'jsProd', 'stylesProd', 'assetsProd', 'libsProd'], 
                ['buildProd', 'imagemin']
                // 'zip'
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