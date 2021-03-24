import {useState, useRef, useEffect} from 'react';
import {Button, Space, InputNumber} from 'antd';

import './style.scss';

const Actions = () => {
    let [fileList, setFileList] = useState([]);
    let [row, setRow] = useState(1);
    let [col, setCol] = useState(1);
    let upload = useRef(null);

    let clear = () => {
        setFileList([]);
    }

    let loadToCanvas = () => {

    }

    useEffect(() => {
        upload.current.addEventListener('change', (e) => {
            for (let img of e.target.files) {
                fileList.push(URL.createObjectURL(img))
            }
            setFileList([...fileList]);
        })
    }, []);

    return (
        <div>
            <Space direction="vertical">
                <input type="file" accept="image/*" multiple id="load" ref={upload}/>
                <Button type="danger" onClick={clear}>清空图片</Button>
                <Button onClick={loadToCanvas}>导入画布</Button>
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

            <ol className="img-preview-list">
                {
                    fileList.map((src) => {
                        return (
                            <li key={src}>
                                <img src={src} alt=""/>
                            </li>
                        )
                    })
                }
            </ol>
        </div>
    );
}

export default Actions;