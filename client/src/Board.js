import React, {
    Component,
    PureComponent
} from 'react';
import {
    fetchChallenge,
    fetchCurrentUser,
    userNameChange,
    LOGIN_FORM,
    formsActions,
    checkUserName,
    initCreateChallenge,
    registerUser,
    createChallenge,
    logout
} from './actions/index';
import { connect } from 'react-redux';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Divider from 'material-ui/Divider';
import { withRouter } from 'react-router';
import { Route, Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { withStyles } from 'material-ui/styles';
import Loading from './components/Loading';


class Board extends Component {
    render() {
        if (this.props.challenge.loading) {
            return <Loading />;
        }
        const { user } = this.props;
        if (!user._id) {
            return null;
        }
        return <Grid container align='center' justify='center' direction='column'>
            <Paper className='common-paper'>
                <Grid item>
                    <h1 className='text-center' style={{margin: 0}}>BOARD</h1>
                    <hr />
                    <UserInfo user={this.props.user} />
                    <hr />
                    <h3 className='text-center' style={{margin: 0}}>LET'S GET INTO BATTLE</h3>
                    <CreateChallengeConnected />
                </Grid>
            </Paper>
        </Grid>
    }
}


export default connect(
    state => ({
        user: state.user.userData,
        challenge: state.user.currentChallenge
    })
)(withRouter(Board));


class CreateChallenge extends PureComponent {
    componentDidMount() {
        const { current_challenge_id } = this.props.user;
        if (current_challenge_id && !this.props.challenge.data) {
            this.props.fetchChallenge({id: current_challenge_id});
        }
    }

    render() {
        const { inited } = this.props.challenge;
        let buttonElem = [
            <Button color='primary'
                    key='current'
                    disabled={!this.props.challenge.data || !this.props.challenge.data._id}
                    onClick={() => {
                        this.props.history.push(`/challenge/${this.props.challenge.data._id}`);
                    }}>
                Current
            </Button>,
            <Button color='primary'
                    className='simple-button'
                    key='list'
                    onClick={() => {
                        this.props.history.push('/challenges/');
                    }}>
                List
            </Button>
        ]

        if (inited) {
            buttonElem.push(
                <Button color='primary'
                        key='private'
                        onClick={() => {
                            this.props.createChallenge({
                                user_id: this.props.user._id,
                                access: 'private'
                            }).then(ch => {
                                this.props.history.push(`/challenge/${ch._id}`);
                            })
                        }}>
                    Private
                </Button>,
                <Button color='primary'
                        key='public'
                        onClick={() => {
                            this.props.createChallenge({
                                user_id: this.props.user._id,
                                access: 'public'
                            }).then(ch => {
                                this.props.history.push(`/challenge/${ch._id}`);
                            })
                        }}>
                    Public
                </Button>
            );
        } else {
            buttonElem.push(
                <Button color='primary'
                        key='public'
                        onClick={() => {
                            this.props.initCreateChallenge()
                        }}>
                    New
                </Button>
            );
        }
        return <Grid container justify='center' align='center' style={{marginBottom: 8, marginTop: 3}} direction='column'>
            <Grid item>
                {buttonElem}
            </Grid>
            <Grid item>
                <Button color='accent'
                        onClick={() => {
                            this.props.logout();
                            localStorage.setItem('jwt_token', null);
                            this.props.history.push('/');
                        }}>
                    LOGOUT
                </Button>
            </Grid>
        </Grid>
    }
}


const CreateChallengeConnected = connect(
    state => ({
        user: state.user.userData,
        challenge: state.user.currentChallenge,
        inited: state.user.currentChallenge.inited
    }),
    dispatch => bindActionCreators({
        createChallenge,
        initCreateChallenge,
        fetchChallenge,
        logout
    }, dispatch)
)(withRouter(CreateChallenge));


const UserInfo = props =><Grid container justify='center'>
    <Grid item className='text-center'>
        <p style={{margin: '10px 0'}} className='text-center'>
            <strong>{props.user.name}'s summary</strong>
        </p>
        <p style={{margin: '0'}} className='text-center'>
            Completed: {props.user.challengesCompleted || 0}. Score: {props.user.score || 0}
        </p>
        <Button raised color='accent' style={{margin: '10px 0'}}>CHECK PROGRESS</Button>
    </Grid>
</Grid>
