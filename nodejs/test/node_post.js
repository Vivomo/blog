var https = require('https');
var querystring = require('querystring');

var contents = querystring.stringify({});

var options = {
    host:'',
    path:'',
    method:'POST',
    headers:{
        'Content-Type':'application/json;charset=UTF-8',
        'Content-Length':contents.length,
        'Cookie': ''
    }
}

var req = https.request(options, function(res){
    res.setEncoding('utf8');
    res.on('data',function(data){
        console.log("data:",data);   //一段html代码
    });
});

req.write(contents);
req.end;