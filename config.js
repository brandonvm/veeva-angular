var baseDirs = {
    sourceRoot: "src/",
    codeRoot: 'com',
    destinationPath: 'build',
    mapPath: 'maps',
    sharedName: 'ng-shared',
    presentationName: 'Veeva Presentation'
};

var configObject = {
    typeScriptSource: [baseDirs.sourceRoot + "**/*.ts", baseDirs.sourceRoot + "**/**/*.ts"],
    jsSource: [baseDirs.sourceRoot + "**/*.js", baseDirs.sourceRoot + "**/**/*.js"],
    htmlSource: [baseDirs.sourceRoot + '**/*.html', baseDirs.sourceRoot + '**/**/*.html', '!' + baseDirs.sourceRoot + 'index.html'],
    scssSource: [baseDirs.sourceRoot + '**/*.scss', baseDirs.sourceRoot + '**/**/*.scss'],
    assetsSource: [baseDirs.sourceRoot + '**/*.+(jpg|jpeg|png|gif|svg|pdf|mp4|eot|otf|ttf|woff|woff2)', baseDirs.sourceRoot + '**/**/*.+(jpg|jpeg|png|gif|svg|pdf|mp4|eot|otf|ttf|woff|woff2)'],
    buildSource: [baseDirs.destinationPath + '/**/*', baseDirs.destinationPath + '/**/**/*'],
    imgBuildSource: [baseDirs.destinationPath + '/**/*.+(jpg|png|gif|svg)', baseDirs.destinationPath + '/**/**/*.+(jpg|png|gif|svg)']    
};

var staticConfig = {
    nodeModulesSource : "node_modules/**",
    vendorsDestinationPath: baseDirs.destinationPath + '/shared/js/libs',    
    vendorsLibraries : [
        'core-js/client/shim.min.js',
        'zone.js/dist/**',
        'reflect-metadata/Reflect.js',
        'systemjs/dist/system.src.js',
        '@angular/**/bundles/**',
        'rxjs/**/*.js',
        'angular-in-memory-web-api/bundles/in-memory-web-api.umd.js',
        'jquery/dist/jquery.min.js',
        'gsap/src/uncompressed/TweenMax.js'
    ],
    deletePath : [baseDirs.destinationPath + '/**'],
    devMode : true
};

exports.config = Object.assign(baseDirs,configObject,staticConfig);