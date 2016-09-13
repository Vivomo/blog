/**
 * Created by ui on 2016/8/5.
 */

var config = {
    circleCount: 120,
    radius: 15,
    lineWidth: 12,
    foreground: '#fff',
    background: '#224589'
}

var canvas = document.getElementById('canvas');
var cxt = canvas.getContext('2d');
canvas.width =  config.radius * 2 + config.lineWidth;
canvas.height = canvas.width * (config.circleCount + 1);
var twoPi = Math.PI * 2;
var halfPi = Math.PI / 2;

// cxt.lineWidth = 50;
// cxt.strokeStyle = '#f00';
// cxt.arc(300, 300, 100, 0, Math.PI, false);
// cxt.stroke();

function extend(obj1, obj2) {
    for (var k in obj2) {
        obj2[k] !== undefined && (obj1[k] = obj2[k])
    }
}
var Ring = function (cxt, config) {
    this.cxt = cxt;
    extend(this, config);
    cxt.lineWidth = config.lineWidth;
}

Ring.prototype.draw = function (x, y, start, end) {
    var cxt = this.cxt;
    cxt.beginPath();
    cxt.strokeStyle = this.background;
    cxt.arc(x, y, this.radius, 0, twoPi);
    cxt.stroke();
    cxt.closePath();


    cxt.beginPath();
    cxt.strokeStyle = this.foreground;
    cxt.arc(x, y, this.radius, start, end, false);
    cxt.stroke();
    cxt.closePath();

}

var ring = new Ring(cxt, config);
var x = canvas.width / 2;
var circleCount = config.circleCount;
for (var i = 0; i <= circleCount; i++) {
    ring.draw(x, x * i * 2 + x, -halfPi, twoPi * (i / config.circleCount) - halfPi)
}


