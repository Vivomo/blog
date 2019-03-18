let request = require('request');

let url = 'https://www.bj520.com/index.php?c=form_shouye';

let s = 0;
let e = 0;
setInterval(() => {
    request({
        url: url,
        method: "POST",
        json: true,
        headers: {
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        formData: {
            'data[xzcs]': '三亚',
            'data[psstyle]': '自然',
            'data[title]': 'SB 铂爵广告',
            'data[tel]': 15715715715
        },
        // body: JSON.stringify(requestData)
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log('success', ++s);
        } else {
            console.log('error', ++e);

        }
    });
}, 50);
