import { createApp } from 'vue';
import App from './App.vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';

library.add(fas);
library.add(far);
library.add(fab);

import MLoadingClient from './components/loading/MLoadingClient.vue';

const app = createApp(App);

app.component('MLoadingClient', MLoadingClient);

app.component('font-awesome-icon', FontAwesomeIcon);

import VueClickAway from 'vue3-click-away';
import VCalendar from 'v-calendar';
import 'v-calendar/dist/style.css';
import VueLazyLoad from 'vue3-lazyload';
import HttpService from './js/axiosConfig';
import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-bootstrap.css';

const routes = [
    {
        path: '/',
        name: 'dashboard',
        components: {
            routerAdmin: () => import('./view/overview/OverviewGame.vue'),
        },
    },

    {
        path: '/login',
        name: 'login',
        component: () => import('./view/login/Login.vue'),
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

app.use(VueClickAway);
app.use(VCalendar, {});
app.use(VueLazyLoad, {
    preLoad: 1.3,
    attempt: 1,
    listenEvents: ['scroll'],
});
app.use(VueToast, {
    position: 'top-right',
    duration: 3000,
});

// Vue.config.devtools = false;
// Vue.config.debug = false;
// Vue.config.silent = true;

app.use(router).mount('#app');
HttpService.configure();
