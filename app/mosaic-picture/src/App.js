import { useState } from 'react';
import { Layout } from 'antd';
import Actions from './components/actions';
import Canvas from './components/canvas';
import ImgDrawer from './components/imgDrawer';

import './App.scss';

const { Header, Sider, Content } = Layout;

const App = () => {
    let [fileList, setFileList] = useState([]);
    let [imgDrawerVisible, setImgDrawerVisible] = useState(false);

    return (
        <Layout style={{height: '100vh'}}>
            <Sider theme="light">
                <Actions
                    fileList={fileList}
                    showImgList={() => {
                        setImgDrawerVisible(true);
                    }}
                />
            </Sider>
            <Layout>
                {/*<Header theme="light">Header</Header>*/}
                <Content className="main-box">
                    <Canvas/>
                    <ImgDrawer
                        visible={imgDrawerVisible}
                        fileList={fileList}
                        setFileList={setFileList}
                        onClose={() => {
                            setImgDrawerVisible(false);
                        }}
                    />
                </Content>
            </Layout>
        </Layout>
    );
}

export default App;
