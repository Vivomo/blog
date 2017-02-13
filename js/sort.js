(function(){
    function Rect(left, height){
        if (this.constructor != Rect) {
            return new Rect(left, height)
        }
        this.left = left;
        this.height = height;
    }
    Rect.prototype = {
        constructor : Rect,
        set left(num){
            this._left = num;
            this.elem && (this.elem.style.transform = 'translateX('+ num+'px)');
        },
        get left(){
            return this._left;
        },
        set height(num){
            this._height = num;
            this.elem && (this.elem.style.height = 2*num+'px');
        },
        get height(){
            return this._height;
        },
        toString : function () {
            return '<div style="transform: translateX('+this.left+'px); height:'+this.height+'px"></div>';
        }

    };

    function swipeRect(rectArr, num, num2){
        var r1 = rectArr[num],
            r2 = rectArr[num2];

        var temp = r1.left;
        r1.left = r2.left;
        r2.left = temp;

        var tempRect = r1;
        rectArr[num] = rectArr[num2];
        rectArr[num2] = tempRect;
    }

    function getRectArr(num) {
        var rectArr = [];
        for (var i = 0; i < num; i++) {
            rectArr.push(new Rect(i*30+10, ~~(Math.random() * 100)));
        }
        return rectArr;
    }
    
    function initRectElem(wrap, rectArr) {
        wrap.innerHTML = rectArr.join('');
        for (var i = 0, l = wrap.children.length; i < l; i++) {
            rectArr[i].elem = wrap.children[i];
        }
    }


    function cloneRectArr(rectArr){
        var tempArr = [];
        if (!rectArr) {
            return tempArr;
        }
        rectArr.forEach(function(item){
            tempArr.push( new Rect(item.left, item.height))
        });
        return tempArr;
    }

    var rectNum = 20;
    var staticRectArr = getRectArr(rectNum);

    var bubbleSortBtn = document.querySelector('#toBubbleSort');
    bubbleSortBtn.addEventListener('click',bubbleSort);

    function bubbleSort(){
        if (bubbleSortBtn.disabled) {
            return false;
        }
        bubbleSortBtn.disabled = true;
        var box = document.querySelector('#bubble-sort');

        var rectArr = cloneRectArr(staticRectArr) || getRectArr(rectNum);
        var data = rectArr.map(function(item){
            return item.height;
        });
        var queen = [];
        initRectElem(box, rectArr);


        for (var i = 0, len = data.length; i < len; i++) {
            for (var j = len - 1; j > i; j--) {
                if (data[j] < data[j-1]) {
                    var temp = data[j];
                    data[j] = data[j-1];
                    data[j-1] = temp;
                    queen.push(j);
                }
            }
        }
        var animate = setInterval(run,250);
        function run(){
            var num = queen.shift();
            swipeRect(rectArr, num, num-1);
            if (queen.length == 0) {
                clearInterval(animate);
                bubbleSortBtn.disabled = false;
            }
        }
    }

    var insertSortBtn = document.querySelector('#toInsertSort');
    insertSortBtn.addEventListener('click',insertSort);
    function insertSort(){
        if (insertSortBtn.disabled) {
            return false;
        }
        insertSortBtn.disabled = true;
        var box = document.querySelector('#insert-sort');

        var rectArr = cloneRectArr(staticRectArr) || getRectArr(rectNum);
        var data = rectArr.map(function(item){
            return item.height;
        });
        var queen = [];
        initRectElem(box, rectArr);

        for (var i = 1, len = data.length; i < len; i++) {
            for (var j = 0; j < i; j++) {
                if (data[i] < data[j]) {
                    for (var k = i; k > j; k--) {
                        var temp = data[k];
                        data[k] = data[k-1];
                        data[k-1] = temp;
                        queen.push([k-1, k]);
                    }
                }
            }
        }
        var animate = setInterval(run,250);
        function run(){
            var num = queen.shift();
            swipeRect(rectArr, num[0], num[1]);
            if (queen.length == 0) {
                clearInterval(animate);
                insertSortBtn.disabled = false;
            }
        }
    }
})();