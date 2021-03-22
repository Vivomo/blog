const gm = require('gm');

gm()
    .in('-page', '+0+0')
    .in('a.png')
    .in('-page', '+0+1440')
    .in('b.png')
    .mosaic()  // Merges the images as a matrix
    .write('./啊.png', function (err) {
        if (err) console.log(err);
    });