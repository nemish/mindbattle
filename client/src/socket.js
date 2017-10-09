import React, {
    PureComponent
} from 'react';

import io from 'socket.io-client';
const socket = io();
let disconnectCallbacks = [];

socket.on('disconnect', () => {
    disconnectCallbacks.forEach(({cb, msg}) => {
        console.log('socket disconnect');
        cb({msg});
        setTimeout(() => window.location.reload(), 5000);
    });
});


export const withSocket = TargetComp => {
    return class withSocket extends PureComponent {
        constructor(props) {
          super(props);
          this.state = {
            inited: false
          };
        }

        render() {
            console.log('render withSocket', this.props.onConnectionLost);
            if (!this.state.inited) {
                this.setState(
                    {inited: false}, () =>
                        disconnectCallbacks.push({
                            cb: this.props.onConnectionLost,
                            msg: [
                                'Ooops... Something happend. Please refresh a page.',
                                'Or it will refreshed automatically',
                                'after 5 seconds...'
                            ]
                        })
                    )
            }
            return <TargetComp socket={socket} {...this.props} />
        }
    }

}

export default socket;