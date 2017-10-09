import React, { PureComponent, Component } from 'react';
import { connect } from 'react-redux';
import './App.css';
import {
    fetchChallenge,
    fetchCurrentUser,
    userNameChange,
    LOGIN_FORM,
    formsActions,
    checkUserName,
    registerUser,
    createChallenge
} from './actions/index';
import Background from './assets/img/bg2.jpg';
import { bindActionCreators } from 'redux';
import { withStyles } from 'material-ui/styles';
import Cookies from 'js-cookie';
import { withRouter } from 'react-router';
import { Route, Link } from 'react-router-dom';
import Challenge from './Challenge';
import Spinner from 'react-spinkit';
import ChallengeList from './ChallengeList';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Board from './Board';
import { handleUser } from './utils/app';
import Dotting from './Dotting';

const loginFormActions = formsActions[LOGIN_FORM];


const styles = theme => ({
  paper: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: theme.spacing.unit * 3,
  })
});


class App extends PureComponent {
    componentDidMount() {
        handleUser(this.props);
    }

    render() {
        let elem = null;
        const { match } = this.props;
        if (this.props.alert.showWindow) {
            elem = <Grid style={{height: '100%'}} container justify='center' align='center' direction='column'>
                <Paper className='common-paper'>
                    <Grid item>
                        {this.props.alert.modalData.msg.map(text => <p key={text} className='text-center'>{text}</p>)}
                    </Grid>
                </Paper>
            </Grid>
        } else if (this.props.loading) {
            elem = <Grid container justify='center' style={{height: '100%'}}>
                <Grid item>
                    <Paper className='common-paper' style={{padding: 10}}>
                        <h4 className='mono-font'><Dotting>Loading</Dotting></h4>
                        <div className='text-center'>
                            <Spinner name='pacman' color='#ccc' />
                        </div>
                    </Paper>
                </Grid>
            </Grid>
        } else {
            elem = <Grid container style={{height: '100%', margin: 0}}>
                <Route path="/board" component={Board} />
                <Route path="/challenges/" component={ChallengeList} />
                <Route path="/challenge/:challengeId" component={Challenge} />
                <Route exact path={match.url} render={() => <WelcomeConnected />}/>
            </Grid>

        }
        return <div className='app-container'>
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: `url(${Background})`,
                backgroundSize: 'cover',
            }}></div>
            {elem}
        </div>
    }
}
               // <Grid item className='text-center'>
               //     <Button raised onClick={() => {
               //
               //         fetch('https://api.unsplash.com/photos/random')
               //             .then(resp => resp.json)
               //             .then(data => console.log(data))
               //         }}>REQUEST UNSPLASH</Button>
               // </Grid>


export default connect(
    state => ({
        ...state.user.userData,
        alert: state.modals.alert
    }),
    dispatch => bindActionCreators({ fetchCurrentUser }, dispatch)
)(App);


class Welcome extends PureComponent {
    componentWillReceiveProps(nextProps) {
        if (nextProps.userId) {
            this.props.history.push('board');
        }
    }

    render() {
        return <UserLoginConnected />
    }
}


const WelcomeConnected = connect(
    state => ({
        userId: state.user.userData._id
    })
)(withRouter(Welcome));





class UserLogin extends PureComponent {
    render() {
        let actionName = null;
        let passwdElem = null;
        if (this.props.name && this.props.name.length) {
            if (this.props.check.data.status) {
                passwdElem = <Grid item style={{margin: '0 10px 20px'}}>
                    <Password fieldName='passwd' {...this.props} />
                </Grid>
            }

            if (this.props.check.data.status === 'password_error') {
                actionName = <span>Sorry, password incorrect for name: {this.props.name}.</span>;
            } else if (this.props.check.data.status === 'occupied') {
                actionName = <span><span>Happy to see you again, {this.props.name}.</span><br /><span>Let's go!</span></span>;
            } else if (this.props.check.data.status === 'ok') {
                actionName = <span>Nice to meet you, {this.props.name}.<br /> Choose the password...</span>;
            }
        }

        let nameElem = null;
        if (this.props.check.loading) {
            nameElem = <Grid item className='text-center'>
                <Dotting><h4>Loading</h4></Dotting>
            </Grid>
        } else if (actionName) {
            nameElem = <Grid item className='text-center' style={{margin: '10px 10px'}}>
                <h4 style={{marginTop: 5, marginBottom: 0, color: '#009933'}}>{actionName}</h4>
            </Grid>
        } else {
            nameElem = <Grid item style={{margin: '10px 10px 20px'}}>
                <UserNameConnected fieldName='name' {...this.props} />
            </Grid>
        }
        return <Grid container align='center' justify='center' style={{height: '100%'}} direction='column'>
            <Paper className='common-paper'>
                <Grid item>
                    <h1 className='text-center' style={{margin: 5}}>WELCOME ON BOARD</h1>
                </Grid>
                <Grid item>
                    <Grid container align='center' justify='center' direction='column'>
                        <form onSubmit={e => e.preventDefault()} style={{width: '95%'}}>
                                {nameElem}
                                {passwdElem}
                                <Grid item className='text-center' style={{marginBottom: 20}}>
                                    <LoginButton {...this.props} />
                                </Grid>
                        </form>
                    </Grid>
                </Grid>
            </Paper>
        </Grid>
    }
}


const handleRegisterUserStep = props => {
    if (props.name && props.passwd) {
        handleUserRegister(props);
    } else {
        handleUserNameCheck(props);
    }
}


const handleUserNameCheck = (props) => {
    return props.checkUserName({
        name: props.name
    })
}


const handleUserRegister = ({ name, passwd, ...remain }) => {
    return remain.registerUser({
        name,
        passwd
    }).then(data => {
        if (data && data.status === 'ok') {
            sessionStorage.setItem('current_user', data.item._id);
            remain.history.push('/board');
        } else if (data && data.status === 'error') {
            console.log(remain);
        }
        return data;
    });
}


const LoginButtonDumb = props => {
    const { name } = props.form;
    const disabled = !name || !name.length || props.checkState.loading;
    return <Button
        disabled={disabled}
        raised
        color="primary"
        onClick={() => handleRegisterUserStep(props)}>And we are ready to go!</Button>;
}


const LoginButton = connect(
    state => ({
        form: state.forms[loginFormActions.key],
        checkState: state.user.checkState
    }),
    dispatch => bindActionCreators({
        handleRegisterUserStep
    }, dispatch)
)(withRouter(LoginButtonDumb));


class UserNameField extends Component {
    render() {
        const { onChange, fieldName } = this.props;
        return <TextField
             fullWidth
             value={this.props[fieldName]}
             name={fieldName}
             label="What's your name?"
             maxLength={16}
             minLength={0}
             onChange={onChange}
             onKeyPress={e => {
                if (e.key === 'Enter'){
                    const { value } = e.target;
                    if (!value) {
                        return;
                    }
                    handleRegisterUserStep(this.props);
                }
             }}
             placeholder='Type something in...' />
    }
}


const PasswordField = props => {
    const { onChange, fieldName } = props;
    return <TextField
         fullWidth
         type='password'
         value={props[fieldName]}
         name={fieldName}
         label="Password"
         maxLength='16'
         minLength='0'
         onChange={onChange}
         onKeyPress={e => {
            if (e.key === 'Enter'){
                const { value } = e.target;
                if (!value) {
                    return;
                }
                handleRegisterUserStep(props);
            }
         }}
         placeholder='Type something in...' />
}


const fieldChanger = formsActions => connect(
    (state, ownProps) => ({
        value: state.forms[formsActions.key][ownProps.fieldName]
    }),
    (dispatch, ownProps) => ({
        onChange(e) {
            dispatch(formsActions.changeValue({
                name: ownProps.fieldName,
                value: e.target.value
            }))
        }
    })
)

const UserNameConnected = withRouter(fieldChanger(loginFormActions)(UserNameField));
const Password = withRouter(fieldChanger(loginFormActions)(PasswordField));


const UserLoginConnected = connect(
    state => ({
        check: state.user.checkState,
        ...state.forms[loginFormActions.key],
        ...state.meta
    }),
    dispatch => bindActionCreators({ checkUserName, registerUser }, dispatch)
)(withStyles(styles)(withRouter(UserLogin)));


