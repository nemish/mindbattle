import React, {
    PureComponent
} from 'react';


export const calcSeconds = (remaining, accuracy) => {
    const val = Math.round(remaining / 100);
    return (val / 10).toFixed(accuracy);
}


export default class Timer extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            remaining: props.end - new Date()
        }
        this.tick = this.tick.bind(this);
        this._calcSeconds = this._calcSeconds.bind(this);
    }

    componentDidMount() {
        this.end = this.props.end;
        this.timer = setInterval(this.tick, this.props.tickInterval);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    tick() {
        const remaining = this.end - new Date();
        if (remaining <= 0) {
            if (this.props.onLimit) {
                this.props.onLimit(this._calcSeconds(0));
            }
        }
        this.setState({
            remaining
        }, () => this.props.onTick ? this.props.onTick(remaining) : null);
    }

    _calcSeconds(remaining) {
        return calcSeconds(remaining, this.props.accuracy)
    }

    render() {
        const seconds = this._calcSeconds(this.state.remaining);
        let styles = {};
        if (this.props.size) {
            styles.fontSize = 10 * this.props.size;
            styles.fontWeight = 'bold';
        }
        return <span style={styles}>{this.props.text}{seconds}</span>;
    }
}


Timer.defaultProps = {
    text: 'Time: ',
    tickInterval: 50,
    accuracy: 1
}