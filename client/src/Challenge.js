import React, {
    Component
} from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Route, Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import {
    fetchChallenge,
    chooseOption
} from './actions/index';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Timer from './components/Timer';



class Challenge extends Component {
    componentDidMount() {
        const { challengeId } = this.props.match.params;
        if (challengeId) {
            this.props.fetchChallenge({id: challengeId});
        } else {
            this.props.history.push('/board');
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.challenge.data && !nextProps.challenge.loading) {
            this.props.history.push('/board');
        }
    }

    render() {
        const { data } = this.props.challenge;
        if (!data || this.props.challenge.loading || !data.questions) {
            return <Grid container>
                <Grid item xs={12}>
                    Loading...
                </Grid>
            </Grid>
        }

        const question = data.questions[data.currentQuestion];
        const { access } = data;
        const { operation, options } = question;
        const answers = data.answers || [];
        return <Grid container justify='center' align='center' direction='column'>
            <Grid item>
                <span>{access} challenge</span>
            </Grid>
            <Grid item>
                <h4 className='text-center'>Choose correct result of operation</h4>
                <h3 className='text-center'>{operation}</h3>
            </Grid>
            <Grid container justify='center'>
                <Grid item className='text-center mono-font'>
                    <Timer start={Date.now()} />
                </Grid>
                <Grid item className='text-center mono-font'>
                    <span>Answers: {answers.length}</span>
                </Grid>
            </Grid>
            <Grid container spacing={8} justify='center' style={{marginTop: 10}}>
                {options.map(
                    (item, index) => <Grid item key={index}><OptionButtonConnected index={index} item={item} /></Grid>
                )}
            </Grid>
            <ExitLink />
        </Grid>
    }
}


export default connect(
    state => ({
        challenge: state.user.currentChallenge
    }),
    dispatch => bindActionCreators({ fetchChallenge }, dispatch)
)(withRouter(Challenge));


const OptionButton = ({ item, index, chooseOption }) => {
    const btnCls = getBtnCls(index);
    return <Button raised color={btnCls} onClick={e => {
        e.preventDefault();
        chooseOption(item);
    }}>{item}</Button>
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


const ExitLink = props => <Grid container justify='center' style={{marginTop: 10}}>
    <Grid item>
        <Link to='/board'>Exit</Link>
    </Grid>
</Grid>