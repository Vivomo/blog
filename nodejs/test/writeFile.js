const fs = require('fs');

fs.writeFile('../../ignore/test.txt', '123', (err) => {
    if (!err) {
        console.log('write');
    }
});