import React from 'react';
import { format } from 'format';

const Example = () => {

    const one = 1;
    const two = 2;
    let obj = {
        value: '值',
        data: `对象数据value: ${one} 数字: ${two}`
    }

    let easy = 'easy';

    alert('弹出')

    let msg = '消息';

    return (
        <div
            title="标题"
            data-msg={`消息数据${msg}`}
        >
            123 {easy} num: {1 + 2 + 3}
            <span>1234</span>
        </div>
    );
};

export default Example;