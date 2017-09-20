let fs = require('fs'),
    path = require('path'),
    config = require("./config").config;

export function getFolders() {        
    let folders:any = [];
    
    fs.readdirSync(config.sourceRoot).filter((file:string) => {
        if(fs.statSync(path.join(config.sourceRoot, file)).isDirectory()) {
            folders.push(file);
        }
    });

    return folders;
}