let htmlSrc = '../test/server/**/*.html';

let browserSync = require("browser-sync").create();

browserSync.init({
    files: ['./*.*'],
    server: {
        baseDir: ['../'],
        index: "../cool-style/science.html",
        serveStaticOptions: {
            extensions: ["html"]
        }
    },
    notify: false,
    host: "10.10.11.62"
});