// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import { store } from './store';
import { reduxStore } from './redux-store';
import * as actions from './redux-store/actions'
import vudux from './vudux';
import VueHelpers from './vue-helpers';

Vue.use(vudux, {reduxStore, actions});
Vue.use(VueHelpers);
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App },
});
