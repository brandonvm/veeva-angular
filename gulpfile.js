const gulpPath = "./gulp",
    files = [
        `${gulpPath}/gulp.other.ts`,
        `${gulpPath}/gulp.common.ts`,
        `${gulpPath}/gulp.dev.ts`,
        `${gulpPath}/gulp.prod.ts`,
        `${gulpPath}/gulpfile.ts`
    ];

files.forEach(function(file) { eval(require("typescript").transpile(require("fs").readFileSync(file).toString())) });