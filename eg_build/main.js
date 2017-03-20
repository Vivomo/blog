var fs = require('fs');
var crypto = require('crypto');
var gulp = require('gulp');
var concat = require('gulp-concat');
var config = require('./config');

// update version number
var versionFile = config.webroot + '/WEB-INF/views/inc/cfg.ftl';
fs.readFile(versionFile, 'utf8', function(err, content){
	if (err) throw err;
	var newVersionNO = genVersionNO();
	content = content.replace(/cfg_version\s*=\s*[\"\'](\w*)[\"\']/g, function(all, version){
		return 'cfg_version=\"' + newVersionNO + '"'; 
	});
	content = content.replace(/cfg_src_path\s*=\s*[\"\']([\/\w]*)[\"\']/g, function(all, srcPath){
		return 'cfg_src_path=\"/gen"'; 
	});
	fs.writeFile(versionFile, content);
});

// pack core js files
var jsFTLFiles = [
	config.webroot + '/WEB-INF/views/admin/inc/scripts.ftl', 
	config.webroot + '/WEB-INF/views/template/default/inc/scripts.ftl'
];

var jsPrefix = [
	'admin', 
	'default'
];

var jsDir = [
	'/admin/js', 
	'/default/js'
];

jsFTLFiles.forEach(function(filePath, i){

	fs.readFile(filePath, 'utf8', function(err, content){
		if (err) throw err;
		var hashCode = md5(filePath + Date.now());
		var newFile = hashCode + '.js';
		gulp.src(getJSFiles(content, jsPrefix[i])).pipe(concat(newFile)).pipe(gulp.dest(config.webgenroot + jsDir[i]));
		fs.writeFile(filePath, '<script src="${cfg_src_path}/js/' + newFile + '"></script>');
	});
});

function genVersionNO(bits){
	var str = '0123456789abcdef',
		ret = '', bits = bits || 16;
	for (var i = 0; i < bits; i++) {
		ret += str.charAt(Math.floor(Math.random() * str.length));
	}
	return ret;
}

function md5(data){
	var _md5 = crypto.createHash('md5');
   _md5.update(data);
   return _md5.digest('hex');
}

function getJSFiles(text, prefix){
	var re = /src=['"]([^'"]+)['"]/g;
	var files = [];
	text.replace(re, function(all, file){
		file = file.replace('${cfg_src_path}', config.webgenroot + '/' + prefix);
		file = file.replace('${cfg_assets_path}', config.webassetsroot);
		file = file.replace('?${cfg_version}', "");

		files.push(file);
	});
	return files;
}

