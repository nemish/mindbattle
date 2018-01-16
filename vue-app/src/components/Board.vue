<template>
  <div class="container">
    <div class='slogan'>
        <h1>BOARD</h1>
    </div>
    <div v-if="!currentOpened" class="full-width">
        <div v-if='newToggled' class='full-width-item-container'>
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
    </div>
    <div v-if="currentOpened" class="full-width">
        <p>Current challenge {{challenge.data._id}}</p>
    </div>
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
            newToggled: false,
            challenge: {
                data: {}
            }
        }
    },
    mounted() {
        this.tryToFetchChallenge(this.userChallengeId);
    },
    components: {
        'full-row-button': FullRowButton
    },
    watch: {
        userChallengeId(newValue, oldValue) {
            console.log('watch userChallengeId', this.userChallengeId, newValue, oldValue);
            if (newValue && oldValue !== newValue) {
                console.log('watch 2', this.userChallengeId, newValue);
                this.tryToFetchChallenge(newValue);
            }
        }
    },
    methods: {
        exit() {
            this.$store.dispatch('logout').then(() => {
                this.$router.push('/');
            });
        },
        tryToFetchChallenge(_id) {
            if (_id && !this.challenge.loading) {
                this.$reduxStore._$callAction('fetchChallenge', {_id });
            }
        },
        newChallenge(access) {
            this.$reduxStore._$callAction('createNewChallenge', {userId: this.userId, access});
        },
        toggleNew() {
            this.newToggled = true;
        },
        _$refreshState() {
            const { current } = this.$reduxStore.getState().challenge;
            if (this.challenge.data._id !== current.data._id && !current.loading) {
                this.userChallengeId = current._id;
                const { _id } = current.data;
                this.$reduxStore._$callAction('fetchChallenge', {_id });
            }
            this.challenge = {
                ...current
            }
        }
    },
    computed: {
        userId: {
            get() {
                return this.$store.state.user._id;
            },
            set() {
                console.log('set()', this.$store.state.user._id);
            }
        },
        showChallengePanel() {
            return (this.userChallengeId && !this.challenge.loading) || this.challenge._id;
        },
        userChallengeId() {
            console.log('userChallengeId', this.$store.state.user.current_challenge_id);
            return this.$store.state.user.current_challenge_id;
        },
        currentOpened() {
            return this.challenge.loading || this.challenge.data._id;
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
