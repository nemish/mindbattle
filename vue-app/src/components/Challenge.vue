<template>
  <div class="container color-tiny-brown">
    <div v-if='challenge._id' class='full-width margin-sm font-poiret'>
        <div class='full-width margin-sm padding-top-md'>
            <transition
                enter-active-class='animated zoomIn'
                leave-active-class='animated zoomOut'>
                <h2 v-if='isReady' class='question-number text-center'>Вопрос {{currentQuestionNumber}}</h2>
            </transition>
            <transition
                enter-active-class='animated zoomIn'
                leave-active-class='animated zoomOut'>
                <p v-if='isReady' class='question-text text-center'>{{currentQuestionText}}</p>
            </transition>
        </div>
    </div>
    <transition
        enter-active-class='animated fadeIn'
        leave-active-class='animated fadeOut'>
        <full-row-button v-if='isReady' text='Выйти' colorType='grey'
                         @click='exit'
                         className="border-round-lg" />
    </transition>
  </div>
</template>

<script>
import {
    mapState,
    mapActions
} from 'vuex';

import FullRowButton from '@/components/FullRowButton';


export default {
    name: 'Challenge',
    data() {
        return {
            isReady: false
        };
    },
    components: {
        'full-row-button': FullRowButton
    },
    watch: {
        userChallengeId(newValue, oldValue) {
            if (newValue && oldValue !== newValue) {
                this.tryToFetchChallenge(newValue);
            }
        }
    },
    mounted() {
        setTimeout(() => {
            this.isReady = true;
        }, 500);
        if (!this.challenge._id) {
            this.tryToFetchChallenge(this.userChallengeId);
        }
    },
    methods: {
        ...mapActions('challenge', [
            'startChallenge',
            'fetch'
        ]),
        exit() {
            this.$router.push({name: 'Board'})
        },
        tryToFetchChallenge(_id) {
            if (_id && !this.challenge.loading) {
                this.fetch(_id);
            }
        },
    },
    computed: {
        ...mapState('challenge', {
            challenge: state => state.data,
            challengeLoading: state => state.loading
        }),
        ...mapState('user', {
            user: state => state
        }),
        userChallengeId() {
            return this.user.current_challenge_id;
        },
        currentQuestionNumber() {
            return this.challenge.currentQuestion + 1;
        },
        currentQuestionText() {
            const question = this.challenge.questions[this.challenge.currentQuestion];
            if (!question.type || question.type === 'math') {
                return `Вычислите результат выражения: ${question.operation}`;
            }
            return question.text;
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.question-number {
    font-size: 52px;
    font-weight: bold;
}

.question-text {
    font-size: 40px;
}

</style>