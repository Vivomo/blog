(function(_window){
    var arrProp = Array.prototype;
    //数组新增某些方法
    //forEach方法从头到尾遍历数组，为每个数组元素调用指定函数并提供当前元素，当前索引与数组当做参数传给函数
    arrProp.forEach||(arrProp.forEach=function(fun){
        var length=this.length;
        for(var i=0;i<length;i++){
            fun(this[i],i,this);
        }
    })
    //map方法遍历数组并调用指定函数，最后返回一个数组，数组由所有函数返回值组成
    arrProp.map||(arrProp.map=function(fun){
        var length=this.length;
        var returnArray=[];
        for(var i=0;i<length;i++){
            returnArray.push(fun(this[i],i,this));
        }
        return returnArray;
    })
    //filter相当一个数组的帅选器，遍历数组并调用指定函数，并返回一个新数组，如果函数返回true则添加返回的数组。
    arrProp.filter||(arrProp.filter=function(fun){
        var length=this.length;
        var returnArray=[];
        for(var i=0;i<length;i++){
            if(fun(this[i],i,this)){
                returnArray.push(this[i]);
            }
        }
        return returnArray;
    })
    //every 遍历数组调用指定函数，当所有函数都返回true 则every返回true否则返回false。
    arrProp.every||(arrProp.every=function(fun){
        var length=this.length;
        if(length==0) return true;
        //every应该尽早结束循环
        for(var i=0;i<length;i++){
            if(!fun(this[i],i,this)){
                return false;
            }
        }
        return true;
    })
    //some 遍历数组调用指定函数，当有一个函数返回true就返回true,当所有函数都返回false就返回false
    arrProp.some||(arrProp.some=function(fun){
        var length=this.length;
        if(length==0) return false;
        //some应该尽早结束循环
        for(var i=0;i<length;i++){
            if(fun(this[i],i,this)){
                return true;
            }
        }
        return false;
    })
    //reduce 遍历数组调用指定函数(函数需要2个参数)，每次把调用函数的返回值与下一个元素当做函数参数继续调用。
    //对数组进行求和等操作很实用
    arrProp.reduce||(arrProp.reduce=function(fun,initval){
        var length=this.length;
        if(length==0) return "";
        if(length==1){
            return initval?fun(initval,this[0]):this[0];
        }
        var val=initval,
            firstindex=initval?0:2;
        if(!initval){
            val=fun(this[0],this[1]);
        }
        for(var i=firstindex;i<length;i++){
            val=fun(val,this[i]);
        }
        return val;
    })
    //reduceRight 与reduce一样 只是从右到左遍历数组
    arrProp.reduceRight||(arrProp.reduceRight=function(fun,initval){
        var length=this.length;
        if(length==0) return "";
        if(length==1){
            return initval?fun(initval,this[0]):this[0];
        }
        var val=initval,
            firstindex=initval?length-1:length-3;
        if(!initval){
            val=fun(this[length-1],this[length-2]);
        }
        for(var i=firstindex;i>=0;i--){
            val=fun(val,this[i]);
        }
        return val;
    })
    arrProp.indexOf||(arrProp.indexOf=function(val){
        var length=this.length;
        if(!length){
            return -1;
        }
        for(var i=0;i<length;i++){
            if(this[i]===val){
                return i;
            }
        }
        return -1;
    })
    arrProp.lastIndexOf||(arrProp.lastIndexOf=function(val){
        var length=this.length;
        if(!length){
            return -1;
        }
        for(var i=length-1,k=0;i>=0;i--){
            k++;
            if(val===this[i]){
                return k;
            }
        }
        return -1;
    })
    arrProp.isArray||(arrProp.isArray=function(){
        return Object.prototype.toString.call(this)==="[object Array]";
    })


    //bind

})(window);
