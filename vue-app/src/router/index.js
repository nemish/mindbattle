import Vue from 'vue';
import Router from 'vue-router';
import Welcome from '../components/Welcome';
import Board from '../components/Board';
import Challenge from '../components/Challenge';
import SuggestQuestion from '../components/SuggestQuestion';
import ChallengeList from '../components/ChallengeList';

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
        {
            path: '/challenge/',
            name: 'challenge',
            component: Challenge,
        },
        {
            path: '/suggest/',
            name: 'SuggestQuestion',
            component: SuggestQuestion,
        },
        {
            path: '/list/',
            name: 'ChallengeList',
            component: ChallengeList,
        }
    ],
});
