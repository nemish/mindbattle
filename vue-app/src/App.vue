<template>
  <div id="app">
    <div v-if='isFirst' id='bg' :class='bgImg'>
        <div class="bg-cloak"></div>
    </div>
    <div class='app-container'>
        <div class='container-wrapper'>
            <transition
                enter-active-class='animated fadeIn'
                leave-active-class='animated fadeOut'>
                <router-view/>
            </transition>
        </div>
    </div>
  </div>
</template>

<script>
import {
    mapActions
} from 'vuex';

import { withSocket } from './socket';

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


export default withSocket({
    name: 'app',
    data() {
        return {
            isFirst: true,
            bgImg: 'bg_num_' + getRandomInt(4, 9)
        }
    },
    methods: {
        ...mapActions('user', [
            'fetchCurrentUser'
        ]),
        toggleBg() {
            this.bgImg = 'bg_num_' + getRandomInt(4, 9);
        }
    },
    created() {
        // setInterval(() => {
        //     this.toggleBg();
        // }, 3000);
        this.fetchCurrentUser().then(() => {
            console.log('everithing ok fetch current user');
            if (this.$route.name === 'Welcome') {
                this.$router.push({name: 'Board'});
            }
        }).catch(err => {
            console.log('error during fetch current user');
            this.$router.push('/');
        });
    }
});
// export default withSocket({
//     name: 'app',
//     created() {
//         this.$store.dispatch('fetchCurrentUser').then(() => {
//             this.$router.push('/board');
//         }).catch(err => {
//             this.$router.push('/');
//         });
//     },
// });
</script>

<style lang='stylus'>
/*@import url('https://fonts.googleapis.com/css?family=Amatic+SC|Fira+Sans+Extra+Condensed|Forum|Jura|Lato|Marmelad|Poiret+One|Russo+One');*/
@import url('https://fonts.googleapis.com/css?family=Amatic+SC');
@import url('https://fonts.googleapis.com/css?family=Fira+Sans+Extra+Condensed');
@import url('https://fonts.googleapis.com/css?family=Poiret+One');
@import url('https://fonts.googleapis.com/css?family=Marmelad');
@import url('https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css');

html,body {
    height: 100%;
    width: 100%;
    padding: 0;
    margin: 0;
    font-family: 'Amatic SC', sans-serif;
    overflow-x: hidden;
}

button {
    font-family: 'Amatic SC', sans-serif;
}

* {
    box-sizing: border-box;
    line-height: 100%;
}


.font-poiret {
    font-family: 'Poiret One', 'Amatic SC', sans-serif;
}

.font-amatic {
    font-family: 'Amatic SC', sans-serif;
}

input {
    font-size: 2em;
}

#app {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    width: calc(100% + 50px);
    padding-right: 50px;
    color: #fff;
}

input:focus,
select:focus,
textarea:focus,
button:focus {
    outline: none;
}
button {
    border: none;
    background-color: #00cc66;
    padding: 10px 30px;
    color: #fff;
}


#bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    zIndex: -1;
}

.bg-cloak {
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
}

h1,h2,h3,h4,p {
    margin: 0;
    padding: 0;
}

h1 {
    font-size: 5em;
}

h2 {
    font-size: 2em;
}

.text-center {
    text-align: center;
}


.full-width.text-center > * {
    text-align: center;
}


.app-container {
    width: 100%;
    min-height: 100%;
    position: relative;
}

.container-wrapper {
    max-width: 500px;
    height: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 0 auto;
    font-weight: normal;
    padding: 0 10px;
}

.container-wrapper > div {
    animation-duration: .5s;
}

.container {
    font-weight: normal;
    display: flex;
    flex-direction: column;
}

.container > div {
    flex: 1;
}


.full-width-item-container {
    display: flex;
}

.full-width-item-container div {
    display: flex;
    flex: 1;
}

.full-width {
    // display: flex;
    // flex-direction: column;
}

.full-width > * {
    width: 100%;
    // flex-basis: auto;
    // flex: 1;
    // flex-shrink: 0;
}

.margin-sm {
    margin: 5px;
}

.padding-sm {
    padding: 5px;
}

.padding-md {
    padding: 10px;
}

.padding-lg {
    padding: 20px;
}

.border-round-lg {
    border-radius: 15px;
}

.border-round-md {
    border-radius: 10px;
}

.border-round-lg-left {
    border-radius: 15px 0 0 15px;
}

.border-round-lg-right {
    border-radius: 0 15px 15px 0;
}

.border-round-xl {
    border-radius: 50px;
}

.bg-darken-green-opacity {
    background-color: rgba(114, 160, 80, 0.6);
}

.bg-yellow-opacity {
    background-color: rgba(0, 120, 160, 0.6);
}

.bg-yellow-true-opacity {
    background-color: rgba(238, 255, 15, 0.6);
}

.bg-yellow-2-opacity {
    background-color: rgba(255, 100, 100, 0.6);
}

.bg-tomato-opacity {
    /*background-color: #8B5133;*/
    background-color: rgba(139, 81, 51, 0.6);
}

.bg-grey-opacity {
    background-color: rgba(100, 100, 100, 0.6);
}

.bg-white {
    background-color: rgba(255, 255, 255, 0.6);
    color: #333;
}

.bg-dark-green {
    background-color: rgba(0, 110, 74, 0.7);
    color: #eee;
}


.color-tiny-brown {
    color: #F5F0E0;
}

.color-brown-green {
    color: #9BC59D;
}

.margin-left-lg {
    margin-left: 30px;
}

.padding-sides-lg {
    padding: 0 30px;
}

.padding-top-md {
    padding: 15px 0 0 0;
}

.margin-bottom-lg {
    margin-bottom: 30px;
}

.shadow-sm {
    box-shadow: 0px 2px 2px -1px rgba(0,0,0,0.75);
}

.flex {
    display: flex;
}

.wrap {
    flex-wrap: wrap;
}

.basis-70 > div:nth-child(odd) {
    flex-basis: 70%;
}

.basis-70 > div:nth-child(even) {
    flex-basis: 30%;
}

for num in (4..9)
    #bg.bg_num_{num}
        background url('./assets/img/bg' + num + '.jpg')
        background-color: #032056;
        background-position: center center;
        background-size: cover;

</style>