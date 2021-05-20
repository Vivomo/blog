import React from 'react';
import { format } from 'format';

const Example = () => {

    let obj = {
        value: format({ id: 'value'}),
        data: format({ id: 'obj-data'}, { value: 1, num: 2 })
    }

    let easy = 'easy';

    alert(format({id: 'alert'}))

    let msg = format({id: 'msg'});

    return (
        <div
            title={format({id: 'title'})}
            data-msg={format({id: 'data-msg'}, {name: 'data-msg'})}
        >
            {
                format({
                    id: '123'
                }, {
                    easy,
                    name: 'name',
                    num: 1 + 2 + 3
                })
            }
            <span>{format({ id: '1234'})}</span>
        </div>
    );
};

export default Example;