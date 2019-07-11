class Component {
    constructor(props) {
        this.state = {
            value: 3
        };
        this.props = props;
        
        this.state = Component.getDerivedStateFromProps();
        this.render();
        this.componentDidMount();
    }

    static getDerivedStateFromProps = (props, value) => {
        return {value};
    };

    setState(state) {
        this.state = state;
        this.state = Component.getDerivedStateFromProps();
        this.shouldComponentUpdate(state);
    }

    forceUpdate(state) {
        this.state = state;
        this.state = Component.getDerivedStateFromProps();
        this.render();
        this.getSnapshotBeforeUpdate();
        this.componentDidUpdate();
    }
    
    getSnapshotBeforeUpdate() {
        
    }

    shouldComponentUpdate(state) {
        if (state.value % 2) {
            this.render();
            this.getSnapshotBeforeUpdate();
            this.componentDidUpdate();
        }
    }
    
    render() {
        console.log(this.state.value, this.props);
    }
    
    componentDidUpdate() {
        
    }

    componentDidMount() {
        console.log('componentDidMount', this.state.value);
    }


}

let comp = new Component(123);
comp.setState(4);
comp.setState(5);
