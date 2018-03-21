let htmlSrc = '../test/server/**/*.html';

let browserSync = require("browser-sync").create();

browserSync.init({
    files: [htmlSrc],
    server: {
        baseDir: ["../css/", "../js/", "../test/server/"],
        index: "../test/server/index.html",
        serveStaticOptions: {
            extensions: ["html"]
        }
    },
    notify: false,
    host: "192.168.20.105"
});