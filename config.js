var baseDirs = {
    sourceRoot: "src/",
    tmpRoot: ".tmp/",
    codeRoot: 'com',
    destinationPath: 'build',
    mapPath: 'maps',
    sharedName: 'ng-shared',
    presentationName: 'Veeva Presentation',
    sharedPreffix: '/shared/js/module/footer/',
    slidePreffix: './app/'
};

var configObject = {
    typeScriptSource: [baseDirs.sourceRoot + "**/*.ts", baseDirs.sourceRoot + "**/**/*.ts"],
    jsSource: [baseDirs.sourceRoot + "**/*.js", baseDirs.sourceRoot + "**/**/*.js"],
    htmlSource: [baseDirs.sourceRoot + '**/*.html', baseDirs.sourceRoot + '**/**/*.html', '!' + baseDirs.sourceRoot + 'index.html'],
    scssSource: [baseDirs.sourceRoot + '**/*.scss', baseDirs.sourceRoot + '**/**/*.scss'],
    assetsSource: [baseDirs.sourceRoot + '**/*.+(jpg|jpeg|png|gif|svg|pdf|mp4|eot|otf|ttf|woff|woff2)', baseDirs.sourceRoot + '**/**/*.+(jpg|jpeg|png|gif|svg|pdf|mp4|eot|otf|ttf|woff|woff2)'],
    buildSource: [baseDirs.destinationPath + '/**/*', baseDirs.destinationPath + '/**/**/*'],
    imgBuildSource: [baseDirs.destinationPath + '/**/*.+(jpg|png|gif|svg)', baseDirs.destinationPath + '/**/**/*.+(jpg|png|gif|svg)'],    

    typeScriptTmp: [baseDirs.tmpRoot + "**/*.ts", baseDirs.tmpRoot + "**/**/*.ts"],
    jsTmp: [baseDirs.tmpRoot + "**/*.js", baseDirs.tmpRoot + "**/**/*.js"],
    htmlTmp: [baseDirs.tmpRoot + '**/*.html', baseDirs.tmpRoot + '**/**/*.html', '!' + baseDirs.tmpRoot + 'index.html'],
    scssTmp: [baseDirs.tmpRoot + '**/*.scss', baseDirs.tmpRoot + '**/**/*.scss'],
    assetsTmp: [baseDirs.tmpRoot + '**/*.+(jpg|jpeg|png|gif|svg|pdf|mp4|eot|otf|ttf|woff|woff2)', baseDirs.tmpRoot + '**/**/*.+(jpg|jpeg|png|gif|svg|pdf|mp4|eot|otf|ttf|woff|woff2)'],
    buildTmp: [baseDirs.tmpRoot + '/**/*', baseDirs.tmpRoot + '/**/**/*'],
    imgBuildTmp: [baseDirs.tmpRoot + '/**/*.+(jpg|png|gif|svg)', baseDirs.tmpRoot + '/**/**/*.+(jpg|png|gif|svg)']    
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