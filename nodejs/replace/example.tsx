import React from 'react';
import { format } from 'format';

const Example = () => {

    const one = 1;
    const two = 2;
    let obj = {
        value: format({ id: 'value'}),
        data: format({ id: 'obj-data'}, { value: one, num: two })
    }

    let easy = 'easy';

    alert(format({id: 'alert'}))

    let msg = format({id: 'msg'});

    return (
        <div
            title={format({id: 'title'})}
            data-msg={format({id: 'data-msg'}, {name: msg})}
        >
            {
                format({
                    id: '123'
                }, {
                    easy,
                    num: 1 + 2 + 3
                })
            }
            <span>{format({ id: '1234'})}</span>
        </div>
    );
};

export default Example;