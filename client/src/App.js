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
    resetUser,
    registerUser,
    login,
    setTokenToApp,
    createChallenge
} from './actions/index';
import UserLogin from './components/UserLogin';
import Background from './assets/img/bg2-min.jpg';
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
import Loading from './components/Loading';
import { handleUser } from './utils/app';
import Dotting from './Dotting';
import Dimensions from 'react-dimensions'



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
            elem = <Loading />
        } else {
            elem = <Grid container style={{height: '100%', margin: 0}}>
                <Route path="/board" component={Board} />
                <Route path="/challenges/" component={ChallengeList} />
                <Route path="/challenge/:challengeId" component={Challenge} />
                <Route exact path={match.url} render={() => <WelcomeConnected />}/>
            </Grid>

        }
        return <div className='app-container' style={{
            maxWidth: this.props.containerWidth
        }}>
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: -1,
                backgroundColor: '#032056',
                backgroundImage: `url(${Background})`,
                backgroundSize: 'cover',
            }}>
                <div style={{
                    position: 'absolute',
                    bottom: 20
                }}></div>
            </div>
            {elem}
        </div>
    }
}


export default connect(
    state => ({
        userId: state.user.userData._id,
        token: state.user.userData.token,
        loading: state.user.userData.loading,
        alert: state.modals.alert
    }),
    dispatch => bindActionCreators({
        fetchCurrentUser,
        setTokenToApp
    }, dispatch)
)(Dimensions()(App));


class Welcome extends PureComponent {
    componentWillReceiveProps(nextProps) {
        if (nextProps.userId) {
            this.props.history.push('board');
        }
    }

    render() {
        return <UserLogin />
    }
}


const WelcomeConnected = connect(
    state => ({
        userId: state.user.userData._id
    })
)(withRouter(Welcome));




const BackButton = connect(
    null,
    dispatch => bindActionCreators({ resetUser }, dispatch)
)(props => {
    return <Button
        raised
        color="default"
        onClick={() => props.resetUser()}>BACK</Button>;
});





