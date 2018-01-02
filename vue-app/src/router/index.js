import Vue from 'vue';
import Router from 'vue-router';
import Welcome from '../components/Welcome';
import Board from '../components/Board';

Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'Welcome',
            component: Welcome,
        },
        {
            path: '/board',
            name: 'Board',
            component: Board,
        },
    ],
});
