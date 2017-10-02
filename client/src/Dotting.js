import React, {
    PureComponent
} from 'react';

const dots_conf = ['', '.', '..', '...'];

export default class Dotting extends PureComponent {

    constructor(props) {
      super(props);
      this.state = {
        currentDot: 0
      };
      this.tick = this.tick.bind(this);
    }

    componentDidMount() {
        this.timer = setInterval(this.tick, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    tick() {
        if (this.state.currentDot >=3) {
            this.setState({
                currentDot: 0
            });
        } else {
            this.setState({
                currentDot: this.state.currentDot + 1
            });
        }
    }

    render() {
        return <span>{this.props.children}{dots_conf[this.state.currentDot]}</span>
    }
}