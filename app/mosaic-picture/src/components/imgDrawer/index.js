import React, { useRef} from 'react';
import {Button, Drawer, Row, Col, Image} from 'antd';

import './style.scss';

const ImgDrawer = ({visible, onClose, fileList, setFileList}) => {
    let upload = useRef(null);

    let clear = () => {
        setFileList([]);
        upload.current.value = '';
    }

    let loadToCanvas = () => {

    }

    let loadImg = (e) => {
        for (let img of e.target.files) {
            fileList.push(URL.createObjectURL(img))
        }
        setFileList([...fileList]);
    }


    return (
        <Drawer
            title="图片列表"
            width={500}
            forceRender
            visible={visible}
            onClose={onClose}
        >
            <input type="file" accept="image/*" multiple id="load" ref={upload} onChange={loadImg}/>
            <Button type="danger" onClick={clear}>清空图片</Button>
            <Row
                gutter={[16, 24]}
            >
                {
                    fileList.map((src) => {
                        return (
                            <Col span={6} key={src}>
                                <Image src={src} alt="" className="thumb-img"/>
                            </Col>
                        )
                    })
                }
            </Row>
        </Drawer>
    );
};

export default ImgDrawer;