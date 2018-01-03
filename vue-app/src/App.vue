<template>
  <div id="app">
    <div id='bg'></div>
    <div class='app-container'>
        <router-view/>
    </div>
  </div>
</template>

<script>
// import { withSocket } from './socket';
export default {
    name: 'app',
    created() {
        console.log('BEFORE FETCHING CURRENT USER');
        this.$store.dispatch('fetchCurrentUser').then(() => {
            console.log('everithing ok fetch current user');
            this.$router.push('/board');
        }).catch(err => {
            console.log('error during fetch current user');
            this.$router.push('/');
        });
    },
};
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


.app-container {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    overflow: auto;
    overflow: hidden;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.7);
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

.container {
    width: 500px;
    font-weight: normal;
    position: relative;
    display: flex;
    overflow: auto;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
</style>
