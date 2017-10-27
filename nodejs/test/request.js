var http=require('http');
//get 请求外网
http.get('http://www.ecma-international.org/ecma-262/6.0/',function(req,res){
    var html='';
    req.on('data',function(data){
        html+=data;
    });
    req.on('end',function(){
        console.info(html.length);
    });
});