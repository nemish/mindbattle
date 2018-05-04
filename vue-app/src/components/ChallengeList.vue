<template>
  <div :class="['container', 'challenge-list']">
    <transition
        enter-active-class='animated flipInX'
        leave-active-class='animated flipOutX'>
        <div class='full-width text-center' v-if='isReady'>
            <h1>ВСЕ МАТЧИ</h1>
        </div>
    </transition>
    <transition
        enter-active-class='animated flipInX'
        leave-active-class='animated flipOutX'>
        <div v-if="isReady && !hasChallenges" class="full-width font-poiret padding-md">
            <p class='text-center'>Извиняй! Нет текущих матчей.</p>
            <full-row-button text='МОЖЕШЬ СОЗАТЬ СВОЙ'
                             className='border-round-lg'
                             colorType='green'
                              />
        </div>
        <div v-if="isReady && hasChallenges" class="full-width font-poiret bg-darken-green-opacity border-round-md padding-md shadow-sm">
            <div v-for="(item, index) in challengesToShow" :key='item._id' class='challenge-row basis-60'>
                <div class="flex wrap basis-60">
                    <div>{{getPlayerName(item)}}</div>
                    <div>{{item.playersCount}}/{{item.maxPlayers}}</div>
                    <div class='date-container font-amatic basis-self-100'>{{new Date(item.timestamp).toLocaleString()}}</div>
                </div>
                <div>
                    <full-row-button className='border-round-lg'
                                     @click='handleJoinChallenge(item)'
                                     :text='joinButtonText(item)'
                                     colorType='white' />
                </div>
            </div>
        </div>
    </transition>
    <transition
        enter-active-class='animated flipInX'
        leave-active-class='animated flipOutX'>
        <full-row-button @click='back'
                         className='border-round-lg'
                         text='Назад'
                         colorType='grey' />
    </transition>
  </div>
</template>

<script>
import {
    mapActions,
    mapState
} from 'vuex';
import FullRowButton from './FullRowButton';

export default {
    name: 'ChallengeList',
    data() {
        return {
            isReady: false
        };
    },
    watch: {
        userId(newValue, oldValue) {
            if (!oldValue && newValue) {
                this.fetchChallenges(newValue);
            }
        },
        challenges(newValue, oldValue) {
            console.log('watch challenges', newValue, oldValue);
            if (newValue.length !== oldValue.length && newValue.indexOf(item => !item._id) > -1) {
                this.fetchChallenges();
            }
        }
    },
    mounted() {
        if (this.userId) {
            this.fetchChallenges(this.userId);
        }
    },
    components: {
        'full-row-button': FullRowButton
    },
    computed: {
        ...mapState({
            user: state => state.user,
            userId: state => state.user._id
        }),
        challenges() {
            return this.$store.state.challenges.data;
        },
        challengesToShow() {
            return this.challenges.filter(ch => !!ch._id);
        },
        hasChallenges() {
            return !!this.challenges.length;
        },
    },
    methods: {
        ...mapActions('challenge', [
            'startChallenge', 'joinChallenge'
        ]),
        ...mapActions('challenges', ['fetchChallenges']),
        joinButtonText(item) {
            if (item.userId === this.userId) {
                return this._challengeRunning(item) ? 'К МАТЧУ' : 'НАЧАТЬ';
            }
            return this.user.current_challenge_id && item._id === this.user.current_challenge_id ? 'WAIT' : 'JOIN';
        },
        _challengeRunning(item) {
            return item.state === 'RUNNING';
        },
        handleJoinChallenge(challenge) {
            const { userId } = challenge;
            if (userId === this.userId) {
                if (this._challengeRunning(challenge)) {
                    this.$router.push({name: 'challenge'});
                } else {
                    this.startChallenge(challenge._id).then(() => {
                        this.$router.push({name: 'challenge'});
                    });
                }
            } else if (!this.user.current_challenge_id || challenge._id !== this.user.current_challenge_id) {
                this.joinChallenge({
                    userId: this.userId,
                    challengeId: challenge._id
                }).then(() => {
                    this.$router.push({name: 'Board'});
                });
            } else {
                this.$router.push({name: 'Board'})
            }
        },
        back() {
            this.$router.go(-1);
        },
        getPlayerName(item) {
            return item.players.filter(pl => pl._id === item.userId)[0].name;
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='stylus' scoped>

.challenge-row {
    padding 10px 0
    display flex
    font-size 24px
    flex-wrap wrap
    border-bottom 1px solid #ccc
    &:last-child {
        border-bottom none
    }
}

.challenge-row span {
    font-family 'Amatic SC', sans-serif
    font-size 14px
}

.date-container {
    font-size 1.2em
    color #000
    font-weight bold
    flex-basis 100% !important
}

.flex > div {
    display flex
    align-items center
}


</style>