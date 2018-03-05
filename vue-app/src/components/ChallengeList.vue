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
        <div v-if="isReady" class="full-width font-poiret bg-darken-green-opacity border-round-md padding-md shadow-sm">
            <div v-for="(item, index) in challenges" :key='item._id' class='challenge-row'>
                <div>{{getPlayerName(item)}}</div>
                <div>{{item.playersCount}}/{{item.maxPlayers}}</div>
                <div class='date-container'>{{new Date(item.timestamp).toLocaleString()}}</div>
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
import { mapActions } from 'vuex';
import FullRowButton from './FullRowButton';
export default {
    name: 'Welcome',
    data() {
        return {
            isReady: false
        };
    },
    mounted() {
        this.fetchChallenges();
    },
    components: {
        'full-row-button': FullRowButton
    },
    computed: {
        challenges() {
            return this.$store.state.challenges.data;
        }
    },
    methods: {
        ...mapActions('challenges', ['fetchChallenges']),
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
}

.challenge-row > div {
    flex 1
    flex-basis 50%
}

.challenge-row span {
    font-family 'Amatic SC', sans-serif
    font-size 14px
}

.date-container {
    flex-basis 100%
}


</style>