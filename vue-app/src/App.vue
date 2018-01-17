<template>
  <div id="app">
    <div id='bg'></div>
    <div class='app-container'>
        <div class='container-wrapper'>
            <router-view/>
        </div>
    </div>
  </div>
</template>

<script>
import { withSocket } from './socket';
export default withSocket({
    name: 'app',
    created() {
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

<style>
html,body {
    height: 100%;
    width: 100%;
    padding: 0;
    margin: 0;
}

#app {
    width: 100%;
    height: 100%;
    font-family: 'Roboto', sans-serif;
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
    background-color: #032056;
    background-image: url(./assets/img/bg2-min.jpg);
    background-size: cover;
}

h1,h2,h3,h4,p {
    margin: 0;
    padding: 0;
}

.text-center {
    text-align: center;
}


.app-container {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    background-color: rgba(0, 0, 0, 0.8);
}

.container-wrapper {
    width: 500px;
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

    font-weight: normal;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
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

.border-round {
    border-radius: 5px;
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
    background-color: rgba(255, 100, 0, 0.5);
}

.bg-grey-opacity {
    background-color: rgba(100, 100, 100, 0.4);
}

.bg-white {
    background-color: rgba(255, 255, 255, 0.4);
    color: #333;
}


</style>