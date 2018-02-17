<template>
  <div id="app">
    <div v-if='isFirst' id='bg' :class='bgImg'></div>
    <div class='app-container'>
        <div class='container-wrapper'>
            <router-view/>
        </div>
    </div>
  </div>
</template>

<script>
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
        toggleBg() {
            this.bgImg = 'bg_num_' + getRandomInt(4, 9);
        }
    },
    created() {
        // setInterval(() => {
        //     this.toggleBg();
        // }, 3000);
        this.$store.dispatch('fetchCurrentUser').then(() => {
            console.log('everithing ok fetch current user');
            this.$router.push('/board');
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
    // font-family: 'Marmelad', sans-serif;
    /*font-family: 'Amatic', sans-serif;*/
    /*font-family: 'Amatic SC', sans-serif;*/
}

button {
    font-family: 'Amatic SC', sans-serif;
    // font-family: 'Marmelad', sans-serif;
}

* {
    box-sizing: border-box;
}


.font-poiret {
    font-family: 'Poiret One', cursive;
}

input {
    font-size: 2em;
}

#app {
    width: 100%;
    height: 100%;
    overflow: hidden;
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


.app-container {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    background-color: rgba(0, 0, 0, 0.7);
}

.container-wrapper {
    max-width: 500px;
    height: 100%;
    position: relative;

    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;
    justify-content: center;
    margin: 0 auto;
    font-weight: normal;
}

.container {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: -17px; /* Increase/Decrease this value for cross-browser compatibility */
    overflow-y: scroll;
    overflow-x: hidden;

    font-weight: normal;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding: 0 10px 0 1px;
}

.container > div {
    flex: 1;
}


.full-width-item-container {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;
}

.full-width-item-container > div {
    width: 100%;
}

.full-width {
    width: 100%;
}

.margin-sm {
    margin: 5px;
}

.padding-sm {
    padding: 5px;
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

.bg-darken-green-opacity {
    background-color: rgba(114, 160, 80, 0.5);
}

.bg-yellow-opacity {
    background-color: rgba(0, 120, 160, 0.5);
}

.bg-yellow-2-opacity {
    background-color: rgba(255, 100, 100, 0.5);
}

.bg-tomato-opacity {
    /*background-color: #8B5133;*/
    background-color: rgba(139, 81, 51, 0.5);
}

.bg-grey-opacity {
    background-color: rgba(100, 100, 100, 0.4);
}

.bg-white {
    background-color: rgba(255, 255, 255, 0.4);
    color: #333;
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

for num in (4..9)
    #bg.bg_num_{num}
        background url('./assets/img/bg' + num + '.jpg')
        background-color: #032056;
        background-position: center center;
        background-size: cover;

</style>