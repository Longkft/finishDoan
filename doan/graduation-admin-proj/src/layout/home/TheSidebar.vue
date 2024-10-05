<template>
    <div class="navigation">
        <ul>
            <li>
                <a href="#">
                    <span class="icon">
                        <font-awesome-icon class="ion-icon" :icon="['fab', 'apple']" style="font-size: 3.75rem" />
                    </span>
                    <span class="title">Brand Name</span>
                </a>
            </li>

            <li>
                <router-link class="sidebar-item" to="/">
                    <span class="icon">
                        <font-awesome-icon class="ion-icon" :icon="['fas', 'house-laptop']" />
                    </span>
                    <span class="title">Dashboard</span>
                </router-link>
            </li>

            <!-- <li class="">
                <a href="#">
                    <span class="icon">
                        <font-awesome-icon class="ion-icon" :icon="['far', 'user']" />
                    </span>
                    <span class="title">Customers</span>
                </a>
            </li>

            <li>
                <a href="#">
                    <span class="icon">
                        <font-awesome-icon class="ion-icon" :icon="['far', 'message']" />
                    </span>
                    <span class="title">Messages</span>
                </a>
            </li>

            <li>
                <a href="#">
                    <span class="icon">
                        <font-awesome-icon class="ion-icon" :icon="['fas', 'question']" />
                    </span>
                    <span class="title">Help</span>
                </a>
            </li>

            <li>
                <a href="#">
                    <span class="icon">
                        <font-awesome-icon class="ion-icon" :icon="['fas', 'gear']" />
                    </span>
                    <span class="title">Settings</span>
                </a>
            </li>

            <li>
                <a href="#">
                    <span class="icon">
                        <font-awesome-icon class="ion-icon" :icon="['fas', 'lock']" />
                    </span>
                    <span class="title">Password</span>
                </a>
            </li> -->

            <li @click="btnLogout">
                <a>
                    <span class="icon">
                        <font-awesome-icon class="ion-icon" :icon="['fas', 'arrow-right-from-bracket']" />
                    </span>
                    <span class="title">Sign Out</span>
                </a>
            </li>
        </ul>
    </div>
    <MLoadingClient v-if="showLoadingClient"></MLoadingClient>
    <!-- </div> -->
</template>
<script>
import HttpService from '@/js/axiosConfig';

export default {
    name: 'TheSidebar',
    methods: {
        btnLogout() {
            this.showLoadingClient = true;
            HttpService.axiosClient(`${HttpService.apiUrl}/users/logout`).then(() => {
                HttpService.removeLocalStorage();
                this.$router.replace({ path: '/login', name: 'login' });
                setTimeout(() => {
                    location.reload();
                }, 500);
                setTimeout(() => {
                    this.showLoadingClient = false;
                }, 700);
            });
        },
    },
    created() {},
    data() {
        return {
            showLoadingClient: false,
        };
    },
};
</script>
<style scoped>
/* Style for active router links */
.navigation li .router-link-active,
.navigation li .router-link-exact-active {
    background-color: var(--white);
    color: var(--blue);

    border-top-left-radius: 30px;
    border-bottom-left-radius: 30px;
}

/* Icon and title inside the active router link */
.navigation li .router-link-active .icon,
.navigation li .router-link-exact-active .icon,
.navigation li .router-link-active .title,
.navigation li .router-link-exact-active .title {
    color: var(--blue);
}

/* Curve outside effect for active router links */
.navigation li .router-link-active::before,
.navigation li .router-link-exact-active::before {
    content: '';
    position: absolute;
    right: 0;
    top: -50px;
    width: 50px;
    height: 50px;
    background-color: transparent;
    border-radius: 50%;
    box-shadow: 35px 35px 0 10px var(--white);
    pointer-events: none;
}

.navigation li .router-link-active::after,
.navigation li .router-link-exact-active::after {
    content: '';
    position: absolute;
    right: 0;
    bottom: -50px;
    width: 50px;
    height: 50px;
    background-color: transparent;
    border-radius: 50%;
    box-shadow: 35px -35px 0 10px var(--white);
    pointer-events: none;
}
</style>
