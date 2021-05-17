import {useState, useRef, useEffect} from 'react';
import {Button, Space, InputNumber, Radio} from 'antd';

import './style.scss';

const Actions = ({showImgList, fileList}) => {
    let [row, setRow] = useState(1);
    let [col, setCol] = useState(1);
    let [importType, setImportType] = useState(1);

    let changeImportType = (type) => {
        setImportType(type);
    }

    let loadToCanvas = () => {

    }

    useEffect(() => {

    }, []);

    return (
        <Space direction="vertical">

            <Button onClick={showImgList}>显示图片列表</Button>
            <Button onClick={loadToCanvas}>导入画布</Button>
            <Radio.Group onChange={changeImportType} value={importType}>
                <Radio value={1}>固定宽度</Radio>
                <Radio value={2}>固定高度</Radio>
                <Radio value={3}>C</Radio>
                <Radio value={4}>D</Radio>
            </Radio.Group>
            <Space>
                <InputNumber
                    min={1}
                    max={Math.max(1, fileList.length)}
                    value={row}
                    onChange={(e) => setRow(e.target.value)}
                    formatter={value => `行: ${value}`}
                    parser={value => value.replace('行: ', '')}
                />
                <InputNumber
                    min={1}
                    max={Math.max(1, fileList.length)}
                    value={col}
                    onChange={(e) => setCol(e.target.value)}
                    formatter={value => `列: ${value}`}
                    parser={value => value.replace('列: ', '')}
                />
            </Space>
        </Space>

    );
}

export default Actions;