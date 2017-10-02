import React, {
    Component
} from 'react';


export const calcSeconds = remaining => {
    const val = Math.round(remaining / 100);
    return (val / 10).toFixed(1);
}


export default class Timer extends Component {
    constructor(props) {
        super(props);
        this.tick = this.tick.bind(this);
    }

    componentDidMount() {
        this.end = this.props.end;
        this.timer = setInterval(this.tick, 50);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    tick() {
        const remaining = this.end - new Date();
        if (remaining <= 0) {
            if (this.props.onLimit) {
                this.props.onLimit(calcSeconds(0));
            }
        }
        this.props.onTick(remaining)
    }

    render() {
        const seconds = calcSeconds(this.props.remaining);
        return <span>Time: {seconds}</span>;
    }
}