import React, {
    Component
} from 'react';


export default class Timer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            elapsed: 0
        };
        this.tick = this.tick.bind(this);
    }

    componentDidMount() {
        this.timer = setInterval(this.tick, 50);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    tick() {
        this.setState({
            elapsed: new Date() - this.props.start
        });
    }

    render() {
        const elapsed = Math.round(this.state.elapsed / 100);
        const seconds = (elapsed / 10).toFixed(1);
        return <span>Time: {seconds}</span>;
    }
}