import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { handleUser } from '../utils/app';
import {
    fetchCurrentUser,
    setTokenToApp,
} from '../actions/index';


export default OtherComponent => {
    return connect(state => ({
        userId: state.user.userData._id,
        token: state.user.userData.token,
        loading: state.user.userData.loading
    }), dispatch => bindActionCreators({
        setTokenToApp,
        fetchCurrentUser
    }, dispatch))(class Wrapper extends PureComponent {
        constructor(props) {
            super(props);
            this.handleMount = null;
            this._onMount = this._onMount.bind(this);
        }

        componentDidMount() {
            const prop = this._onMount();
            if (prop && !this.handleMount) {
                this.handleMount = prop;
            }
        }

        _onMount() {
            return handleUser(this.props);
            // let prom = handleUser();
            // cbs = cbs || [];
            // cbs.forEach(({cb, context}) => {
            //     prop = prom.then(val => return cb.apply(context, [val]));
            // });
            // return prop;
        }

        render() {
            return <OtherComponent handleMount={this.handleMount} {...this.props} />
        }
    });
}