import React, { PureComponent, Component } from 'react';
import { connect } from 'react-redux';
import './App.css';
import {
    fetchChallenge,
    chooseOption,
    userNameChange,
    checkUserName,
    createChallenge
} from './actions/index';
import { bindActionCreators } from 'redux';
import Timer from './components/Timer';
import Cookies from 'js-cookie';
import { withRouter } from 'react-router';
import { Route } from 'react-router-dom';
// import io from 'socket.io-client';
// const  socket = io();

class App extends Component {
    render() {
        const { match } = this.props;
        return <div className='app-container'>
            <div className='app-wrapper'>
                <div className='container'>
                    <Route path="/board" component={Board} />
                    <Route exact path={match.url} render={() => <WelcomeConnected />}/>
                </div>
            </div>
        </div>
    }
}


export default App;


class Welcome extends Component {
    render() {
        let components = [];
        if (this.props.user.id) {
            components.push(<UserInfo key={'ui'} user={this.props.user} />);
            if (this.props.challenge.id) {
                components.push(<ChallengeInfo key={'ci'} challenge={this.props.challenge} />);
            } else {
                components.push(<CreateChallenge key={'cc'} />)
            }
        } else {
            components.push(<UserLoginConnected key={'ul'} />);
        }
        return <div>
            {components}
        </div>
    }
}


const WelcomeConnected = connect(
    state => ({
        user: state.user.userData,
        challenge: state.user.currentChallenge
    })
)(Welcome);


export const Board = () => <div>Board</div>


const CreateChallenge = props => <div>
    <div className='row'>
        <div className='col-md-offset-4 col-md-4 col-sm-12'>
            <button>New challenge</button>
        </div>
    </div>
</div>


const UserInfo = props => <div>
    <div className='row'>
        <div className='col-sm-12'>
            <h3 className='text-center'>{props.user.name}</h3>
        </div>
    </div>
</div>


// todo - made a ... appearing smoothly
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
                        }
                        return data
                    })
                    // }).then(data => {
                        // if (data.status == 'ok') {
                            // this.props.router.push('board')
                        // }
                    // })
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
