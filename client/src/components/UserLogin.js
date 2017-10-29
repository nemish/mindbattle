import React, { PureComponent, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withStyles } from 'material-ui/styles';
import {
    fetchChallenge,
    fetchCurrentUser,
    userNameChange,
    LOGIN_FORM,
    formsActions,
    checkUserName,
    resetUser,
    registerUser,
    login,
    createChallenge
} from '../actions/index';
import Cookies from 'js-cookie';
import { withRouter } from 'react-router';
import { Route, Link } from 'react-router-dom';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Loading from './Loading';
import { handleUser } from '../utils/app';
import Dotting from '../Dotting';

const loginFormActions = formsActions[LOGIN_FORM];

const userLoginStyles = {
    actionName: {marginTop: 5, marginBottom: 0, color: '#009933'},
    errors: {marginTop: 5, marginBottom: 0, color: 'red'}
}

class UserLogin extends PureComponent {
    render() {
        let actionName = null;
        let msgElem = null;

        let passwdElem = null;
        if (this.props.check.data.status) {
            passwdElem = <Grid item style={{margin: '0 10px 20px'}}>
                <Password fieldName='passwd' {...this.props} />
            </Grid>
        }

        console.log('UserLogin render', this.props.name, this.props.check.data);
        if (this.props.name && this.props.name.length) {
            if (this.props.check.data.status === 'password_error') {
                actionName = <span>Sorry, password incorrect for name: {this.props.name}.</span>;
            } else if (this.props.check.data.status === 'occupied') {
                actionName = <span><span>Happy to see you again, {this.props.name}.</span><br /><span>Type in your password and go!</span></span>;
            } else if (this.props.check.data.status === 'empty_field') {
                actionName = <span>Please enter your name</span>;
            } else if (this.props.check.data.status === 'ok') {
                actionName = <span>Nice to meet you, {this.props.name}.<br /> Choose the password...</span>;
            }
        }

        if (this.props.check.loading) {
            msgElem = <Grid item className='text-center'>
                <Dotting><h4>Loading</h4></Dotting>
            </Grid>
        } else if (actionName) {
            let errorsElem = null;
            if (this.props.errors.msg && !this.props.form.__isDirty) {
                errorsElem = <h4 style={userLoginStyles.errors}>{this.props.errors.msg}</h4>
            }
            msgElem = <Grid item className='text-center' style={{margin: '10px 10px'}}>
                <h4 style={userLoginStyles.actionName}>{actionName}</h4>
                {errorsElem}
            </Grid>
        }

        let backBtn = null;
        // if (passwdElem) {
        //     backBtn = <BackButton {...this.props} />
        // }
        return <Grid container align='center' justify='center' style={{height: '100%'}} direction='column'>
            <Grid item>
                <p className='text-center' style={{margin: '10px 0', color: '#ddd', fontSize: 50}}>MATHBATTLE</p>
                <hr style={{color: '#ddd'}} />
                <p className='text-center' style={{color: '#eee', fontSize: 20}}>calc your level</p>
            </Grid>
            <Paper className='common-paper'>
                <Grid item>
                    <h1 className='text-center' style={{margin: 5}}>WELCOME ON BOARD</h1>
                </Grid>
                <Grid item>
                    <Grid container align='center' justify='center' direction='column'>
                        <form onSubmit={e => e.preventDefault()} style={{width: '95%'}}>
                                {msgElem}
                                <Grid item className='text-center' style={{margin: '10px 10px'}}>
                                    <UserNameConnected fieldName='name' {...this.props} />
                                </Grid>
                                {passwdElem}
                                <Grid item className='text-center' style={{marginBottom: 20}}>
                                    {backBtn}
                                    {' '}
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
        return handleUserRegister(props);
    } else {
        return handleUserNameCheck(props);
    }
}


const handleUserNameCheck = (props) => {
    return props.checkUserName({
        name: props.name
    });
}


const handleUserRegister = ({ name, passwd, check, ...remain }) => {
    let fn = remain.registerUser;
    if (check.data.status === 'occupied') {
        fn = remain.login;
    }
    return fn({
        name,
        passwd
    }).then(data => {
        if (data && data.status === 'ok') {
            localStorage.setItem('jwt_token', data.token);
            remain.history.push('/board');
        }
        return data;
    });
}


const LoginButtonDumb = props => {
    const { name, passwd } = props.form;
    const disabled = (!name || !name.length) || (props.check.data.status && (!passwd || !passwd.length)) || props.check.loading || props.form.loading;
    return <Button
        disabled={disabled}
        raised
        color="primary"
        onClick={() => handleRegisterUserStep(props)}>NEXT</Button>;
}

const LoginButton = connect(
    state => ({
        form: state.forms[loginFormActions.key],
        check: state.user.checkState
    }),
    dispatch => bindActionCreators({
        registerUser, checkUserName, login
    }, dispatch)
)(withRouter(LoginButtonDumb));


const UserNameField = props => {
    return <LoginTextField label="What's your name?" fieldName='name' {...props} />
}


const PasswordField = props => {
    return <LoginTextField type='password' label="Password" fieldName='passwd' {...props} />
}


const LoginTextField = props => {
    const { onChange, fieldName, value } = props;
    return <TextField
         fullWidth
         value={value || ''}
         name={fieldName}
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


const fieldChanger = actionsConf => connect(
    (state, ownProps) => {
        return {
            value: state.forms[actionsConf.key][ownProps.fieldName]
        }
    },
    (dispatch, ownProps) => ({
        onChange(e) {
            dispatch(actionsConf.changeValue({
                name: ownProps.fieldName,
                value: e.target.value
            }))
        },
        ...bindActionCreators({ checkUserName, registerUser, login }, dispatch)
    })
)

const getConnectedField = FieldComponent => {
    return withRouter(fieldChanger(loginFormActions)(FieldComponent));
}

const UserNameConnected = getConnectedField(UserNameField);
const Password = getConnectedField(PasswordField);


const UserLoginConnected = connect(
    state => ({
        form: state.forms[loginFormActions.key],
        check: state.user.checkState,
        errors: state.errors.userErrors,
        ...state.forms[loginFormActions.key]
    })
)(withRouter(UserLogin));

export default UserLoginConnected;