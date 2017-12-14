<template>
  <div id="app">
    <div id='bg'></div>
    <div class='app-container'>
        <router-view/>
    </div>
  </div>
</template>

<script>
export default {
    name: 'app',
    created() {
        this.$store.dispatch('fetchCurrentUser');
    },
};
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
    color: #fff;
}


.app-container {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
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

h1,h2,h3,p {
    margin: 0;
    padding: 0;
}
</style>
