import { Layout } from 'antd';
import Actions from './components/actions';
import Canvas from './components/canvas';

import './App.scss';

const { Header, Sider, Content } = Layout;

const App = () => {
    return (
        <Layout style={{height: '100vh'}}>
            <Sider>
                <Actions/>
            </Sider>
            <Layout>
                <Header>Header</Header>
                <Content className="main-box">
                    <Canvas/>
                </Content>
            </Layout>
        </Layout>
    );
}

export default App;
