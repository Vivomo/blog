(function () {
    avalon.config({
        interpolate: ["[[","]]"]
    })
    var vm = avalon.define({
        $id : 'square',
        w : 100,
        list : []
    });
    var coordsArr = avalon.range(0, 100).map(function (num) {
        return {
            x : num % 10,
            y : ~~ (num / 10)
        }
    });
    avalon.scan();
    setTimeout(function () {
        document.querySelector('.square').className += ' show';
        setTimeout(function () {
            avalon.range(1, 30).forEach(function (i) {
                setTimeout(function () {
                    vm.list.push({
                        height : 0,
                        coords : getRandomCoords()
                    });
                    setTimeout(function () {
                        vm.list[vm.list.length - 1].height = Math.random() * 500;
                    }, 10);
                }, i * 100 + 1000);
            });
        }, 3500);
    }, 100);
    function getRandomCoords(){
        return coordsArr.splice(~~(Math.random() * coordsArr.length), 1)[0]
    }
})();
