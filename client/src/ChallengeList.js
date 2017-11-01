import React, { PureComponent, Component } from 'react';
import { connect } from 'react-redux';
import './App.css';
import {
    fetchChallengeList,
    fetchCurrentUser,
    joinChallenge
} from './actions/index';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { Route, Link } from 'react-router-dom';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import { withStyles } from 'material-ui/styles';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import { withSocket } from './socket';
import baseComp from './components/baseComp';


const styles = theme => ({
  root: {
    marginTop: theme.spacing.unit * 3
  },
  table: {
    width: 400,
    overflowX: 'auto'
  },
});


class ChallengeList extends PureComponent {
    constructor(props) {
      super(props);

      this.state = {};
    }

    componentWillReceiveProps(props) {
        if (props.handleMount) {
            props.handleMount.then(item => {
                this._load(props, item._id);
            })
        } else if (props.user._id) {
            this._load(props, props.user._id);
        }
    }

    _load(props, user_id) {
        console.log('_load', props, user_id);
        if (!props.fetchingChallenges && !props.challengeList.data.items.length) {
            // props.fetchChallengeList({ user_id })
        }
    }

    render() {
        console.log('render challenges list', this.props.fetchingChallenges);
        const { classes } = this.props;
        const { data, loading } = this.props.challengeList;
        const { items } = data;
        let elem = <Grid item>
            <Grid item>
                <h4 className='text-center'>Active challenges:</h4>
            </Grid>
            <Paper className={classes.root}>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell numeric>#</TableCell>
                    <TableCell>OWNER</TableCell>
                    <TableCell numeric>CREATED AT</TableCell>
                    <TableCell numeric>PLAYERS</TableCell>
                    <TableCell numeric>STATE</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map(n => {
                    return (
                      <TableRow key={n.timestamp}>
                        <TableCell>
                            <Button disabled={n.playersCount == n.maxPlayers}
                                color="primary"
                                raised
                                onClick={() => {
                                    this.props.joinChallenge({
                                        id: n._id,
                                        user_id: this.props.user._id
                                    }).then(data => {
                                        this.props.socket.emit('challenge_update', {data});
                                        this.props.history.push(`/challenge/${n._id}`);
                                    });
                                }}>{n.state === 'INITIAL' ? 'Join' : 'Watch'}</Button>
                        </TableCell>
                        <TableCell>{n.userName}</TableCell>
                        <TableCell>{new Date(n.timestamp).toLocaleString()}</TableCell>
                        <TableCell className='text-center'>{n.playersCount}/{n.maxPlayers}</TableCell>
                        <TableCell>{n.state}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Paper>
        </Grid>
        if (!items.length) {
            elem = <Grid item>
                <h4>No active challenges...</h4>
            </Grid>
        }
        return <Grid container justify='center' align='center' direction='column'>
            <Paper className='common-paper' style={{overflowX: 'auto'}}>
                <Grid item className='text-center'>
                    <Button onClick={() => this.props.history.push('/board/')}>Back to Board</Button>
                </Grid>
                {elem}
            </Paper>
        </Grid>
    }
}


ChallengeList.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default connect(
    state => ({
        user: state.user.userData,
        challengeList: state.challengeList
    }),
    dispatch => bindActionCreators({
        fetchChallengeList,
        joinChallenge
    }, dispatch)
)(withRouter(withSocket(withStyles(styles)(baseComp(ChallengeList)))));