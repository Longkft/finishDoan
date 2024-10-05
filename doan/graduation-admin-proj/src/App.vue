<template>
    <div class="container" v-if="isLogined == true">
        <TheSidebar></TheSidebar>
        <ContentAdmin></ContentAdmin>
    </div>
    <LoginAdmin v-else></LoginAdmin>
</template>

<script>
import ContentAdmin from './layout/home/ContentAdmin.vue';
import TheSidebar from './layout/home/TheSidebar.vue';
import LoginAdmin from './view/login/Login.vue';

export default {
    name: 'App',
    components: {
        ContentAdmin,
        TheSidebar,
        LoginAdmin,
    },
    created() {
        if (localStorage.getItem('accessToken')) {
            this.isLogined = true;
            return;
        }

        this.$router.replace({ path: '/login', query: {} }).catch((err) => {
            console.error('Lỗi điều hướng: ', err);
        });
    },
    data() {
        return {
            isLogined: false,
        };
    },
};
</script>

<style>
@import url('./css/main.css');

.container-admin {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    height: 100vh;
}
</style>
