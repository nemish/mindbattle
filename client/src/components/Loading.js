import React from 'react';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import Spinner from 'react-spinkit';
import Dotting from '../Dotting';


const styles = {
    container: {height: '100%'},
    spinner: {width: 100, margin: 'auto'}
}


export default props => <Grid container justify='center' style={styles.container} direction='column'>
    <Grid item className='text-center'>
        <div className='text-center'>
            <Spinner name='pacman' color='#fff' style={styles.spinner} />
        </div>
    </Grid>
</Grid>