import React, { PureComponent, Component } from 'react';
import { connect } from 'react-redux';
import './App.css';
import {
    fetchChallengeList,
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


const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    width: 400,
  },
});



class ChallengeList extends PureComponent {
    componentDidMount() {
        if (!this.props.user._id) {
            this.props.history.push('/');
        } else {
            this.props.fetchChallengeList({user_id: this.props.user._id})
        }
    }

    render() {
        const { classes } = this.props;
        let elem = <Grid item>
            <Grid item>
                <h4 className='text-center'>Active challenges:</h4>
            </Grid>
            <Paper className={classes.root}>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell>OWNER</TableCell>
                    <TableCell numeric>CREATED AT</TableCell>
                    <TableCell numeric>PLAYERS/MAX</TableCell>
                    <TableCell numeric>STATE</TableCell>
                    <TableCell numeric>#</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.props.items.map(n => {
                    return (
                      <TableRow key={n.timestamp}>
                        <TableCell>{n.userName}</TableCell>
                        <TableCell>{new Date(n.timestamp).toLocaleString()}</TableCell>
                        <TableCell>{n.playersCount}/{n.maxPlayers}</TableCell>
                        <TableCell>{n.state}</TableCell>
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
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Paper>
        </Grid>
        if (!this.props.items.length) {
            elem = <Grid item>
                <h4>No active challenges...</h4>
            </Grid>
        }
        return <Grid container justify='center' align='center' direction='column' style={{maxWidth: '100%'}}>
            <Paper className='common-paper' style={{overflowX: 'auto', width: '100%'}}>
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
        items: state.challengeList.data.items
    }),
    dispatch => bindActionCreators({
        fetchChallengeList,
        joinChallenge
    }, dispatch)
)(withRouter(withSocket(withStyles(styles)(ChallengeList))));