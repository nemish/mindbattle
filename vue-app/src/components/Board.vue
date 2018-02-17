<template>
  <div class="container color-tiny-brown">
    <div class='full-width margin-sm padding-top-md'>
        <h1 class="text-center">BOARD</h1>
    </div>
    <div v-if="currentOpened" class="full-width">
        <div class="bg-tomato-opacity padding-sm margin-sm border-round-lg">
            <h2 class='text-center padding-sm'>Текущий матч</h2>
            <div class='info margin-left-lg font-poiret'>
                <p>
                    <info-title msg='Доступ' :value='accessTitle' />
                    <info-title msg='Создан' :value='createdAt' />
                <p>
                    <info-title msg='Статус' :value='challenge.data.state' />
                    <info-title msg='Текущий вопрос' :value='challenge.data.currentQuestion || "матч еще не начался"' />
                </p>
            </div>
            <div class='padding-sides-lg'>
                 <full-row-button :text='challengeEnterButtonText'
                             :additionalInfo='challengeJoinInfo'
                             colorType='white'
                             @click='challengeAction'
                             className='border-round-md' />
            </div>
        </div>
    </div>
    <div class="full-width">
        <div v-if='newToggled' class='full-width-item-container'>
            <div>
                <full-row-button text='Private'
                                 colorType='yellow'
                                 @click='newChallenge("private")'
                                 className="border-round-lg-left" />
            </div>
            <div>
                <full-row-button text='Public'
                                 colorType='yellow'
                                 @click='newChallenge("public")'
                                 className="border-round-lg-right" />
            </div>
        </div>
        <full-row-button className="border-round-lg" v-if='!newToggled' text='NEW CHALLENGE' colorType='yellow'
                         @click='toggleNew' />
    </div>
    <div class="full-width">
        <div class='full-width-item-container'>
            <div>
                <full-row-button text='LIST'
                                 additionalInfo='Готовы к игре: 120. В процессе: 43'
                                 colorType='green'
                                 className="border-round-lg-left" />
            </div>
            <div>
                <full-row-button text='STATS'
                                 additionalInfo='Побед: 0. Опыт: 0'
                                 colorType='blue'
                                 className="border-round-lg-right" />
            </div>
        </div>
    </div>
    <full-row-button text='EXIT' colorType='grey'
                     @click='exit'
                     className="border-round-lg" />
    <div class='full-width margin-bottom-lg'></div>
  </div>
</template>

<script>
import Vue from 'vue';
import FullRowButton from './FullRowButton';
import socket from '../socket';

Vue.component('info-title', {
    props: {
        msg: {
            type: String
        },
        value: {}
    },
    template: '<span><strong class="color-brown-green">{{msg}}:</strong> {{value}}.</span>'
})

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
            if (newValue && oldValue !== newValue) {
                this.challenge.data._id = newValue;
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
        challengeAction() {
            if (this.challenge.data.state === 'INITIAL') {
                if (this.isOwnerOfCurrent) {
                    this.$reduxStore._$callAction('startChallenge');
                } else {
                    this.$reduxStore._$callAction('startChallenge');
                }
            }
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
        challengeJoinInfo() {
            return `Players: ${this.challenge.data.playersCount} / ${this.challenge.data.maxPlayers}`;
        },
        isOwnerOfCurrent() {
            return this.challenge.data.userId === this.userId;
        },
        userId() {
            return this.$store.state.user._id;
        },
        showChallengePanel() {
            return (this.userChallengeId && !this.challenge.loading) || this.challenge._id;
        },
        accessTitle() {
            return this.challenge.data.access === 'public' ? 'все' : 'друзья';
        },
        userChallengeId: {
            get() {
                return this.$store.state.user.current_challenge_id;
            },
            set(newValue) {}
        },
        currentOpened() {
            return this.challenge.loading || this.challenge.data._id;
        },
        createdAt() {
            return new Date(this.challenge.data.timestamp).toLocaleString();
        },
        challengeEnterButtonText() {
            return this.isOwnerOfCurrent ? 'GO!' : 'JOIN';
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


.info {
    font-size: 14px;
    padding: 10px 20px;
}

</style>
