import React, { PureComponent, Component } from 'react';
import { connect } from 'react-redux';
import './App.css';
import {
    fetchChallenge,
    fetchCurrentUser,
    chooseOption,
    userNameChange,
    checkUserName,
    createChallenge
} from './actions/index';
import { bindActionCreators } from 'redux';
import Timer from './components/Timer';
import Cookies from 'js-cookie';
import { withRouter } from 'react-router';
import { Route, Link } from 'react-router-dom';
// import io from 'socket.io-client';
// const  socket = io();

class App extends Component {
    componentDidMount() {
        const userId = sessionStorage.getItem('current_user');
        if (userId) {
            this.props.fetchCurrentUser({user_id: userId});
        }
    }

    render() {
        if (this.props.loading) {
            return <div>Loading</div>
        }
        const { match } = this.props;
        return <div className='app-container'>
            <div className='app-wrapper'>
                <div className='container'>
                    <Route path="/board" component={BoardConnected} />
                    <Route path="/new_challenge" component={CreateChallengeConnected} />
                    <Route exact path={match.url} render={() => <WelcomeConnected />}/>
                </div>
            </div>
        </div>
    }
}


export default connect(
    state => state.user.userData,
    dispatch => bindActionCreators({ fetchCurrentUser }, dispatch)
)(App);


class Welcome extends Component {
    componentWillReceiveProps(nextProps) {
        if (this.prosp.user._id) {
            this.props.history.push('board');
        }
    }

    render() {
        return <UserLoginConnected />
    }
}


const WelcomeConnected = connect(
    state => ({
        user: state.user.userData,
    })
)(withRouter(Welcome));



class Board extends Component {
    render() {
            // components.push();
            // if (this.props.challenge.id) {
            //     components.push();
            // } else {
            //     components.push(<CreateChallenge key={'cc'} />)
            // }
        return <div>
            <UserInfo user={this.props.user} />
            <ChallengeInfo challenge={this.props.challenge} />
            <CreateChallengeConnected />
        </div>
    }
}


const BoardConnected = connect(
    state => ({
        user: state.user.userData,
        challenge: state.user.currentChallenge
    })
)(withRouter(Board));


const CreateChallenge = props => <div>
    <div className='row'>
        <div className='col-md-offset-4 col-md-4 col-sm-12 text-center'>
            <form>
                <div className="input-group fluid">
                    <UserNameConnected {...this.props} />
                    <LoginButton />
                </div>
            </form>
            <button className='primary' onClick={() => props.createChallenge({user_id: this.props.user._id})}>New challenge</button>
        </div>
    </div>
</div>


const CreateChallengeConnected = connect(
    state => ({
        user: state.user.userData
    }),
    dispatch => bindActionCreators({ createChallenge }, dispatch)
)(CreateChallenge);


const UserInfo = props => <div>
    <div className='row'>
        <div className='col-sm-12'>
            <h3 className='text-center'>{props.user.name}</h3>
        </div>
    </div>
</div>


class UserLogin extends Component {
    render() {
        return <div>
            <div className='row'>
                <div className='col-sm-12'>
                    <h3 className='text-center'>Introduce yourself</h3>
                </div>
            </div>
            <div>
                <div className='col-sm-12'>
                    <h5 className='text-center mono-font'>
                        {this.props.check.loading ? 'Wait please...' : this.props.name}
                        {this.props.check.data.status == 'occupied' ? ' - occupied' : ''}
                    </h5>
                </div>
            </div>
            <div className='row'>
                <div className='col-md-offset-4 col-md-4 col-sm-12'>
                    <form onSubmit={e => e.preventDefault()}>
                      <div className="input-group fluid">
                        <UserNameConnected {...this.props} />
                        <LoginButton />
                      </div>
                    </form>
                </div>
            </div>
        </div>
    }
}


const LoginButtonDumb = props => {
    const disabled = !props.userData.name.length || props.checkState.loading;
    return <button
        disabled={disabled}
        className={'primary'}
        onClick={() => props.checkUserName({name: props.userData.name})}>GO</button>;
}


const LoginButton = connect(
    state => state.user,
    dispatch => bindActionCreators({
        checkUserName
    }, dispatch)
)(LoginButtonDumb);


class UserNameField extends Component {
    constructor(props) {
        super(props);

        this.state = {
            placeholder: "What's your name?",
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
                        name: value
                    }).then(data => {
                        if (data && data.status == 'ok') {
                            sessionStorage.setItem('current_user', data.item.id);
                            this.props.history.push('board');
                        }
                        return data;
                    });
                }
             }}
             placeholder={this.state.placeholder} />
    }
}

const UserNameConnected = withRouter(UserNameField);


const UserLoginConnected = connect(
    state => ({
        check: state.user.checkState,
        ...state.user.userData,
        ...state.meta
    }),
    dispatch => bindActionCreators({
        userNameChange,
        checkUserName
    }, dispatch)
)(withRouter(UserLogin));


const ChallengeInfo = props => {
    let challengeElem = <p className='text-center'>No current challenge</p>
    if (props.challenge._id) {
        challengeElem = <Link to={`/challenge/${props.challenge._id}`}>Jump to current challenge</Link>
    }
    return <div className='row'>
        <div className='col-sm-12'>
            {challengeElem}
        </div>
    </div>
}


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
        const { _id } = this.props.challenge;
        if (_id) {
            this.props.fetchChallenge({id: _id});
        }
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
    state => ({
        challenge: state.user.currentChallenge
    }),
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
