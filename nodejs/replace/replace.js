const mapStream = require('map-stream');
const vfs = require('vinyl-fs');
const glob = require('glob');

const cfg = {
    baseDir: '',

};

const log = (file) => {
    console.log(file.path);
}

let r = glob('../*.js', {}, (err, files) => {
    console.log(files)
});

console.log(r)