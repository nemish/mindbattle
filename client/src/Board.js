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
    createChallenge
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
import { handleUser } from './utils/app';


class Board extends Component {
    componentDidMount() {
        handleUser(this.props);
    }

    render() {
        const { user } = this.props;
        if (!user._id) {
            return null;
        }
        return <Grid container align='center' justify='center' direction='column'>
            <Paper style={{padding: 10, opacity: 0.9}}>
                <Grid item>
                    <h1 className='text-center' style={{margin: 0}}>LET'S GET INTO BATTLE</h1>
                    <UserInfo user={this.props.user} />
                    <ChallengeInfoConnected />
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
    }),
    dispatch => bindActionCreators({ fetchCurrentUser }, dispatch)
)(withRouter(Board));


const CreateChallenge = props => {
    const { inited } = props;
    let buttonElem = <Button color='primary'
            onClick={() => {
                props.initCreateChallenge()
            }}>
        New challenge
    </Button>

    if (inited) {
        buttonElem = [
            <Button color='primary'
                    key='private'
                    onClick={() => {
                        props.createChallenge({
                            user_id: props.user._id,
                            access: 'private'
                        }).then(ch => {
                            props.history.push(`/challenge/${ch._id}`);
                        })
                    }}>
                Private
            </Button>,
            <Button color='primary'
                    key='public'
                    onClick={() => {
                        props.createChallenge({
                            user_id: props.user._id,
                            access: 'public'
                        }).then(ch => {
                            props.history.push(`/challenge/${ch._id}`);
                        })
                    }}>
                Public
            </Button>
        ]
    }
    return <Grid container justify='center' style={{marginBottom: 8, marginTop: 3}}>
        <Grid item>
            {buttonElem}
        </Grid>
    </Grid>
}


const CreateChallengeConnected = connect(
    state => ({
        user: state.user.userData,
        inited: state.user.currentChallenge.inited
    }),
    dispatch => bindActionCreators({ createChallenge, initCreateChallenge }, dispatch)
)(withRouter(CreateChallenge));


const UserInfo = props =><Grid container justify='center'>
    <Grid item>
        <Button raised color='accent' style={{margin: '10px 0'}}>
            Name: {props.user.name}. Completed: {props.user.challengesCompleted || 0}. Score: {props.user.score || 0}
        </Button>
    </Grid>
</Grid>



class ChallengeInfo extends PureComponent {
    componentDidMount() {
        const { current_challenge_id } = this.props.user;
        if (current_challenge_id) {
            this.props.fetchChallenge({id: current_challenge_id});
        }
    }

    render() {
        let text = [this.props.challenge.loading ? 'Loading...' : 'No current challenge']
        if (this.props.challenge.data && this.props.challenge.data._id) {
            text = [
                <Link key='1' to={`/challenge/${this.props.challenge.data._id}`}>Current challenge</Link>,
            ]
        }
        text.push(' ', <Link key='2' to={`/challenges/`}>Active challenges</Link>);
        const challengeElem = <p style={{margin: 0}} className='text-center'>{text}</p>
        return <Grid container justify='center'>
            <Grid item>
                {challengeElem}
            </Grid>
        </Grid>
    }
}

const ChallengeInfoConnected = connect(
    state => ({
        user: state.user.userData,
        challenge: state.user.currentChallenge
    }),
    dispatch => bindActionCreators({ fetchChallenge }, dispatch)
)(ChallengeInfo);