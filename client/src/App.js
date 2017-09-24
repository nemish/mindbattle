import React, { PureComponent, Component } from 'react';
import { connect } from 'react-redux';
import './App.css';
import {
    fetchChallenge,
    chooseOption,
    userNameChange,
    checkUserName,
    handshake
} from './actions/index';
import { bindActionCreators } from 'redux';
import Timer from './components/Timer';
import Cookies from 'js-cookie';
// import io from 'socket.io-client';
// const  socket = io();

class App extends Component {
    componentDidMount() {
        if (!this.props.token) {
            this.props.handshake();
        }
    }

    render() {
        if (!this.props.token) {
            return <div>Loading...</div>
        }

        return <div className='app-container'>
            <div className='app-wrapper'>
                <div className='container'>
                    <Welcome />
                </div>
            </div>
        </div>
    }
}


export default connect(
    state => state.meta,
    dispatch => bindActionCreators({ handshake }, dispatch)
)(App);


class Welcome extends Component {
    componentDidMount() {

    }

    render() {
        let components = [];
        if (this.props.user) {
            components.push(<UserInfo key={'ui'} user={this.props.user} />);
            if (this.props.challenge) {
                components.push(<ChallengeInfo key={'ci'} />);
            }
        } else {
            components.push(<UserLoginConnected key={'ul'} />);
        }
        return <div>
            {components}
        </div>
    }
}


const UserInfo = props => <div>
    <div className='row'>
        <div className='col-sm-12'>
            <h3 className='text-center'>{props.user.name}</h3>
        </div>
    </div>
</div>


// todo - made a ... appearing smoothly
const UserLogin = props => {
    return <div>
        <div className='row'>
            <div className='col-sm-12'>
                <h3 className='text-center'>Introduce yourself</h3>
            </div>
        </div>
        <div>
            <div className='col-sm-12'>
                <h5 className='text-center mono-font'>
                    {props.loading ? 'Wait please...' : props.name}
                </h5>
            </div>
        </div>
        <div className='row'>
            <div className='col-md-offset-4 col-md-4 col-sm-12'>
                <form onSubmit={e => e.preventDefault()}>
                  <div className="input-group fluid">
                    <UserNameField {...props} />
                  </div>
                </form>
            </div>
        </div>
    </div>
}


class UserNameField extends Component {
    constructor(props) {
        super(props);

        this.state = {
            placeholder: "What's your name?"
        };
    }

    render() {
        return <input type="text"
             value={this.props.name}
             maxLength='16'
             onChange={e => {
                this.props.userNameChange(e.target.value);
             }}
             onKeyPress={e => {
                if (e.key == 'Enter'){
                    const { value } = e.target;
                    if (!value) {
                        this.setState({ placeholder: 'Type something in...' })
                        return;
                    }
                    this.props.checkUserName({
                        name: e.target.value,
                        token: this.props.token
                    })
                }
             }}
             placeholder={this.state.placeholder} />
    }
}


const UserLoginConnected = connect(
    state => ({
        ...state.user.checkState,
        ...state.user.userData,
        ...state.meta
    }),
    dispatch => bindActionCreators({ userNameChange, checkUserName }, dispatch)
)(UserLogin);


const ChallengeInfo = props => <div className='row'>
    <div className='col-sm-12'>
        <h3 className='text-center'>Инфа по текущей битве</h3>
    </div>
</div>


class Game extends Component {
    render() {
        return <div>
            <Title />
            <ChallengeConnected />
        </div>
    }
}

const Title = () => <div className='row'>
    <div className='col-sm-12'>
        <h3 className='text-center'>CHECK YOUR MATH SKILLS</h3>
    </div>
</div>


class Challenge extends Component {
    componentDidMount() {
        this.props.fetchChallenge();
    }

    render() {
        const { operation, options } = this.props.question.data;
        return <div>
            <div className='row'>
                <div className='col-sm-12'>
                    <h4 className='text-center'>Choose correct result of operation</h4>
                    <h3 className='text-center'>{operation}</h3>
                </div>
            </div>
            <div className='row'>
                <div className='col-md-offset-4 col-md-4 col-sm-12'>
                    <div className='row'>
                        <div className='col-sm-6 text-center mono-font'>
                            <Timer start={Date.now()} />
                        </div>
                        <div className='col-sm-6 text-center mono-font'>
                            <span>Answers: 0</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className='row'>
                <div className='col-sm-12'>
                    <div className='button-group'>
                        {options.map(
                            (item, index) => <OptionButtonConnected key={index} index={index} item={item} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    }
}


const ChallengeConnected = connect(
    state => state.challenge,
    dispatch => bindActionCreators({ fetchChallenge }, dispatch)
)(Challenge);


const OptionButton = ({ item, index, chooseOption }) => {
    const btnCls = getBtnCls(index);
    return <button className={btnCls} onClick={e => {
        e.preventDefault();
        chooseOption(item);
    }}>{item}</button>
    // return <button className={btnCls} onClick={() => {
    //     socket.emit('chooseOption', item);
    // }}>{item}</button>
}


const OptionButtonConnected = connect(
    null,
    dispatch => bindActionCreators({ chooseOption }, dispatch)
)(OptionButton);


const getBtnCls = index => {
    switch (index) {
        case 0:
            return 'primary';
        case 1:
            return 'secondary';
        case 2:
            return 'tertiary';
        default:
            return 'inverse';
    }
}
