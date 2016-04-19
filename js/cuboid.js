(function () {
    avalon.config({
        interpolate: ["[[","]]"]
    });
    var vm = avalon.define({
        $id : 'square',
        w : 100,
        tz : -116000,
        rz : 450,
        list : []
    }),
        cuboidLen = 30,
        square = document.querySelector('.square');

    var coordsArr = avalon.range(0, 100).map(function (num) {
        return {
            x : num % 10,
            y : ~~ (num / 10)
        }
    });
    avalon.scan();
    setTimeout(function () {
        square.className += ' show';
        vm.tz = -1160;
        vm.rz = 45;
        setTimeout(function () {
            avalon.range(1, 30).forEach(function (i) {
                setTimeout(function () {
                    vm.list.push({
                        height : 0,
                        coords : getRandomCoords()
                    });
                    setTimeout(function () {
                        vm.list[vm.list.length - 1].height = Math.random() * 500;
                    }, 50);
                }, i * 100 + 1000);
            });
            setTimeout(function () {
                square.className += ' no-animate';
                rotateVm();
            }, cuboidLen * 100 + 1000);
        }, 3500);
    }, 100);
    function getRandomCoords(){
        return coordsArr.splice(~~(Math.random() * coordsArr.length), 1)[0]
    }
    function rotateVm(){
        document.body.onmousedown = function (e) {
            var startCoords = getCoords(e),
                rz = vm.rz;
            document.onmousemove = function (e){
                var moveCoords = getCoords(e),
                    moved = (startCoords.x - moveCoords.x) * 360 / 500;
                vm.rz = rz + moved;
                console.log(moved);
            };
            document.onmouseup = function () {
                this.onmousemove = null;
            }
        };

    }

    function getCoords(e){
        e = e || window.event;
        return e.pageX ? {
            x : e.pageX,
            y : e.pageY
        } : {
            x : e.clientX + document.body.scrollLeft - document.body.clientLeft,
            y : e.clientY + document.body.scrollTop  - document.body.clientTop
        };
    }
})();
