import React, {
    PureComponent
} from 'react';

import io from 'socket.io-client';
import store from './store';
import modalActions from './actions/modalActions';

const { alertModalActions } = modalActions;
let socket = null;
let disconnectCallbacks = [];


export const withSocket = TargetComp => {
    if (!socket) {
        socket = io();
        socket.on('disconnect', () => {
            alert();
        });

        socket.on('connect_error', (error) => {
            alert();
        });

        function alert() {
            store.dispatch(alertModalActions.open({
                msg: [
                    'Ooops... Something happend. Please refresh a page.',
                    'Or it will refreshed automatically',
                    'after 5 seconds...'
                ]
            }))
            setTimeout(() => window.location.reload(), 5000);
        }
    }

    return class withSocket extends PureComponent {
        constructor(props) {
          super(props);
          this.state = {
            inited: false
          };
        }

        render() {
            // if (!this.state.inited) {
            //     this.setState(
            //         {inited: false},
            //         () => disconnectCallbacks.push({
            //             cb: this.props.onConnectionLost,
            //             msg: [
            //                 'Ooops... Something happend. Please refresh a page.',
            //                 'Or it will refreshed automatically',
            //                 'after 5 seconds...'
            //             ]
            //         })
            //     )
            // }
            return <TargetComp socket={socket} {...this.props} />
        }
    }

}

export default socket;