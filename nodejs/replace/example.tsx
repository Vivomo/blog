import React from 'react';
import { format } from 'format';

const Example = () => {

    alert(format({id: 'alert'}))

    let msg = format({id: 'msg'});

    return (
        <div title={format({id: 'title'})}>
            {
                format({
                    id: '123'
                }, {
                    name: 'name'
                })
            }
        </div>
    );
};

export default Example;