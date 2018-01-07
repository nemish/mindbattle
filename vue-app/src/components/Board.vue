<template>
  <div class="container">
    <div class='slogan'>
        <h1>BOARD</h1>
    </div>
    <div v-if='newToggled' class='new-challenge-buttons-container'>
        <div>
            <full-row-button text='Private'
                             colorType='yellow'
                             @click='newChallenge("private")' />
        </div>
        <div>
            <full-row-button text='Public'
                             colorType='yellow'
                             @click='newChallenge("public")' />
        </div>
    </div>
    <full-row-button v-if='!newToggled' text='NEW' colorType='yellow'
                     @click='toggleNew' />
    <full-row-button text='CURRENT'
                     additionalInfo='STEP #4'
                     colorType='red'>
    </full-row-button>
    <full-row-button text='LIST'
                     additionalInfo='Ready: 120, in process: 43'
                     colorType='green' />
    <full-row-button text='STATS'
                     additionalInfo='Wins: 23, experience: 2320'
                     colorType='blue' />
    <full-row-button text='EXIT' colorType='grey'
                     @click='exit' />
  </div>
</template>

<script>
import FullRowButton from './FullRowButton';
import socket from '../socket';

export default {
    name: 'Board',
    data() {
        return {
            newToggled: false
        }
    },
    mounted() {
        this.$store.dispatch('fetchChallengesInfo');
        // socket.on('info', )
    },
    components: {
        'full-row-button': FullRowButton
    },
    methods: {
        exit() {
            this.$store.dispatch('logout').then(() => {
                this.$router.push('/');
            });
        },
        newChallenge(type) {
            // store.dispatch()
            this.$reduxStore._$actions.createNewChallenge({type});
            createNewChallenge({type});
            // console.log('newChallenge', e);
        },
        toggleNew() {
            console.log('toggleNew');
            this.newToggled = true;
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.container {
    width: 500px;
    font-weight: normal;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.new-challenge-buttons-container {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;
}

.new-challenge-buttons-container > div {
    width: 100%;
}

</style>
