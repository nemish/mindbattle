<template>
  <div class="board-container color-tiny-brown">
    <div class='full-width margin-sm padding-top-md'>
        <transition
            enter-active-class='animated flipInX'
            leave-active-class='animated flipOutX'>
            <h1 v-if='isReady' class="text-center title">BOARD</h1>
        </transition>
    </div>
    <transition
        enter-active-class='animated flipInX'
        leave-active-class='animated flipOutX'>
        <div v-if="isReady && currentOpened" class="full-width">
            <div class="challenge-info bg-tomato-opacity padding-sm border-round-lg">
                <h2 class='text-center padding-sm'>Текущий матч</h2>
                <div class='info margin-left-lg font-poiret'>
                    <p>
                        <info-title msg='Доступ' :value='accessTitle' />
                        <info-title msg='Создан' :value='createdAt' />
                    <p>
                        <info-title msg='Статус' :value='challenge.data.state' />
                        <info-title msg='Текущий вопрос' :value='quesionInfo' />
                    </p>
                </div>
                <div class='padding-sides-lg'>
                    <full-row-button :text='challengeEnterButtonText'
                                 :additionalInfo='challengeJoinInfo'
                                 :disabled='!joinEnabled'
                                 :needSpinner='needJoinSpinner'
                                 colorType='green'
                                 @click='challengeAction'
                                 className='border-round-xl btn-small' />
                </div>
                <div class='padding-sides-lg'>
                     <full-row-button text='покинуть матч'
                                 colorType='blue'
                                 @click='handleExitChallenge'
                                 className='border-round-xl btn-small' />
                </div>
            </div>
        </div>
    </transition>
    <transition
        enter-active-class='animated bounceInRight'
        leave-active-class='animated bounceOutRight'>
        <div v-if="isReady && !currentOpened" class="full-width">
            <transition-group enter-active-class='animated fadeIn'
                        leave-active-class='animated fadeOut'>
                <div v-if='newToggled' class='full-width-item-container' key='first'>
                    <div>
                        <full-row-button text='Друзья'
                                         colorType='yellow'
                                         @click='newChallenge("private")'
                                         className="border-round-lg-left" />
                    </div>
                    <div>
                        <full-row-button text='Все'
                                         colorType='yellow'
                                         @click='newChallenge("public")'
                                         className="border-round-lg-right" />
                    </div>
                </div>
                <full-row-button key='second' className="border-round-lg" v-if='!newToggled' text='НОВЫЙ МАТЧ' colorType='yellow'
                                 @click='toggleNew' />
            </transition-group>
        </div>
    </transition>
    <transition
        enter-active-class='animated bounceInLeft'
        leave-active-class='animated bounceOutLeft'>
        <div v-if='isReady' class="full-width">
            <div class='full-width-item-container'>
                <div>
                    <full-row-button text='ВСЕ МАТЧИ'
                                     :additionalInfoList='challengeListInfo'
                                     @click='challengeList'
                                     colorType='green'
                                     className="border-round-lg-left" />
                </div>
                <div>
                    <full-row-button text='РЕГАЛИИ'
                                     :additionalInfoList='statInfo'
                                     colorType='yellowTrue'
                                     className="border-round-lg-right" />
                </div>
            </div>
        </div>
    </transition>
    <transition
        enter-active-class='animated bounceInRight'
        leave-active-class='animated bounceOutRight'>
        <full-row-button v-if='isReady' text='ПРЕДЛОЖИТЬ ВОПРОС' colorType='darkGreen'
                         @click='suggest'
                         className="border-round-lg" />
    </transition>
    <transition
        enter-active-class='animated bounceInLeft'
        leave-active-class='animated bounceOutLeft'>
        <full-row-button v-if='isReady' text='ВЫХОД' colorType='grey'
                         @click='exit'
                         className="border-round-lg" />
    </transition>
    <div class='full-width margin-bottom-lg'></div>
  </div>
</template>

<script>
import Vue from 'vue';
import FullRowButton from './FullRowButton';
import socket from '../socket';
import {
    mapActions,
    mapState
} from 'vuex';


Vue.component('info-title', {
    props: {
        msg: {
            type: String
        },
        value: {}
    },
    template: '<span><strong class="color-brown-green">{{msg}}:</strong> {{value}}.</span>'
});


export default {
    name: 'Board',
    data() {
        return {
            isReady: false,
            newToggled: false
        }
    },
    mounted() {
        setTimeout(() => {
            this.isReady = true;
        }, 500);
        this.tryToFetchChallenge(this.userChallengeId);
        if (this.userId) {
            this.fetchChallenges(this.userId);
        }
    },
    components: {
        'full-row-button': FullRowButton
    },
    watch: {
        userChallengeId(newValue, oldValue) {
            if (newValue && oldValue !== newValue) {
                // this.challenge.data._id = newValue;
                this.tryToFetchChallenge(newValue);
            }
        },
        userId(newValue, oldValue) {
            if (newValue && oldValue !== newValue) {
                // this.challenge.data._id = newValue;
                this.fetchChallenges(newValue);
            }
        }
    },
    methods: {
        ...mapActions('user', [
            'logout',
        ]),
        ...mapActions('app', [
            'updateState',
        ]),
        ...mapActions('challenges', [
            'fetchChallenges'
        ]),
        ...mapActions('challenge', [
            'fetchChallenge',
            'startChallenge',
            'exitChallenge',
            'joinChallenge',
            'createNewChallenge'
        ]),
        handleExitChallenge() {
            this.exitChallenge({
                challengeId: this.challenge.data._id,
                userId: this.userId
            });
        },
        exit() {
            this.logout().then(() => {
                this.$router.push('/');
            });
        },
        challengeAction() {
            if (this.challenge.data.state === 'INITIAL') {
                if (this.isChallengeOwner) {
                    this.startChallenge(this.challenge.data._id).then(() => {
                        this.$router.push({name: 'challenge'});
                    });
                } else {
                    this.joinChallenge();
                }
            } else {
                this.$router.push({name: 'challenge'});
            }
        },
        tryToFetchChallenge(_id) {
            if (_id && !this.challenge.loading) {
                // this.$reduxStore._$callAction('fetchChallenge', {_id });
                console.log('tryToFetchChallenge', _id);
                this.fetchChallenge(_id);
            }
        },
        newChallenge(access) {
            this.createNewChallenge({userId: this.userId, access}).then(ch => {
                this.updateState({'user.current_challenge_id': ch.data.newChallenge._id});
            });
        },
        toggleNew() {
            this.newToggled = true;
        },
        suggest() {
            this.$router.push({name: 'SuggestQuestion'})
        },
        challengeList() {
            this.$router.push({name: 'ChallengeList'})
        }
    },
    computed: {
        ...mapState({
            challenges: state => state.challenges.data
        }),
        challengeListInfo() {
            let readyCount = this.challenges.filter(item => item.state === 'INITIAL').length;
            let inprocessCount = this.challenges.filter(item => item.state === 'RUNNING').length;
            return [`Готовы к игре: ${readyCount}`, `В процессе: ${inprocessCount}`];
        },
        statInfo() {
            return ['Побед: 0.', 'Опыт: 0'];
        },
        challengeJoinInfo() {
            return `Народу: ${this.challenge.data.playersCount} / ${this.challenge.data.maxPlayers}`;
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
        userChallengeId() {
            return this.challenge.data._id || this.$store.state.user.current_challenge_id;
        },
        currentOpened() {
            return this.challenge.loading || this.challenge.data._id;
        },
        createdAt() {
            return new Date(this.challenge.data.timestamp).toLocaleString();
        },
        challengeStarted() {
            return this.challenge.data.state === 'RUNNING';
        },
        isChallengeOwner() {
            return this.challenge.data.userId === this.userId;
        },
        joinEnabled() {
            return this.challengeStarted || this.isChallengeOwner;
        },
        needJoinSpinner() {
            return !this.joinEnabled;
        },
        challengeEnterButtonText() {
            if (this.challengeStarted) {
                return 'К матчу';
            }
            if (this.isChallengeOwner) {
                return 'НАЧИНАЕМ!';
            }
            return 'Ожидание игроков';
        },
        challenge() {
            return this.$store.state.challenge;
        },
        quesionInfo() {
            const { currentQuestion } = this.challenge.data;
            if (currentQuestion === null) {
                return 'матч еще не начался';
            }
            return currentQuestion + 1;
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.board-container .title {
    margin-top: 40px;
}

.info {
    font-size: 14px;
    padding: 10px 20px;
}

.challenge-info {
    margin: 5px 0;
    box-shadow: 0px 2px 2px -1px rgba(0,0,0,0.75);
}

</style>
