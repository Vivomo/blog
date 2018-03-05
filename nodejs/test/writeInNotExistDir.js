const fs = require('fs');

fs.writeFile('../../ignore/a/test.txt', '123', (err) => {
    if (!err) {
        console.log('write');
    } else {
        console.log(err)
    }
});