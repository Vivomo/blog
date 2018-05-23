let http = require('http');
let queryString = require('querystring');

let data = {
    username: 15715776170,
    password: 'a123456',
    tenant: 'pampas',
    provider: 'tenant',
    grant_type: 'password'
}

let req = http.request({
    hostname: '10.10.100.56',
    port: '8000',
    path: '/ucenter/oauth/token?&&tenant=pampas&provider=tenant&grant_type=password',
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        "Authorization": "Basic aXBhbXBhczppcGFtcGFz",
    },
}, (res) => {
    res.setEncoding('utf8');
    console.log(`状态码: ${res.statusCode}`);
    res.on('data', function (chunk) {
        console.log('Response: ' + chunk);
    });
});

req.end();

req.on('error', function(e) {
    console.log('problem with request: ', e);
});

//get 请求外网
// http.get('http://www.ecma-international.org/ecma-262/6.0/',function(req,res){
//     var html='';
//     req.on('data',function(data){
//         html+=data;
//     });
//     req.on('end',function(){
//         console.info(html.length);
//     });
// });