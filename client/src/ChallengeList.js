import React, { PureComponent, Component } from 'react';
import { connect } from 'react-redux';
import './App.css';
import {
    fetchChallengeList,
    joinChallenge
} from './actions/index';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import { Route, Link } from 'react-router-dom';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import socket from './socket';


class ChallengeList extends PureComponent {
    componentDidMount() {
        if (!this.props.user._id) {
            this.props.history.push('/');
        } else {
            this.props.fetchChallengeList({user_id: this.props.user._id})
        }
    }

    render() {
        let elem = <Grid item>
            <Grid item>
                <h4 className='text-center'>Active challenges:</h4>
            </Grid>
            {this.props.items.map(row => {
                return <Grid container direction='row' align='center' justify='center' key={row.timestamp}>
                    <Grid item>
                        <span>{row.userName}</span>
                    </Grid>
                    <Grid item>
                        <span>{row.playersCount}/{row.maxPlayers}</span>
                    </Grid>
                    <Grid item>
                        <span>{new Date(row.timestamp).toLocaleString()}</span>
                    </Grid>
                    <Grid item>
                        <Button disabled={row.playersCount == row.maxPlayers}
                            onClick={() => {
                            this.props.joinChallenge({
                                id: row._id,
                                user_id: this.props.user._id
                            }).then(data => {
                                socket.emit('challenge_update', {data});
                                this.props.history.push(`/challenge/${row._id}`);
                            });
                        }}>Join</Button>
                    </Grid>
                </Grid>
            })}
        </Grid>
        if (!this.props.items.length) {
            elem = <Grid item>
                <h4>No active challenges...</h4>
            </Grid>
        }
        return <Grid container justify='center' align='center' direction='column'>
            <Paper style={{padding: 10}}>
                <Grid item className='text-center'>
                    <Button onClick={() => this.props.history.push('/board/')}>Back to Board</Button>
                </Grid>
                {elem}
            </Paper>
        </Grid>
    }
}


export default connect(
    state => ({
        user: state.user.userData,
        items: state.challengeList.data.items
    }),
    dispatch => bindActionCreators({
        fetchChallengeList,
        joinChallenge
    }, dispatch)
)(withRouter(ChallengeList));