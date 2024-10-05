<template>
    <div class="container-login">
        <div id="logo">
            <h1><i>ĐĂNG NHẬP</i></h1>
        </div>
        <section class="stark-login">
            <div class="form-input-login">
                <div id="fade-box">
                    <input
                        type="text"
                        v-model="userProfile.email"
                        name="email"
                        id="email"
                        placeholder="Tài khoản"
                        required
                    />
                    <input type="password" v-model="userProfile.password" placeholder="Mật khẩu" required />

                    <button @click="btnLogin">Đăng nhập</button>
                </div>
            </div>
            <div class="hexagons">
                <span>&#x2B22;</span>
                <span>&#x2B22;</span>
                <span>&#x2B22;</span>
                <span>&#x2B22;</span>
                <span>&#x2B22;</span>
                <span>&#x2B22;</span>
                <span>&#x2B22;</span>
                <span>&#x2B22;</span>
                <span>&#x2B22;</span>
                <span>&#x2B22;</span>
                <span>&#x2B22;</span>
                <span>&#x2B22;</span>
                <br />
                <span>&#x2B22;</span>
                <span>&#x2B22;</span>
                <span>&#x2B22;</span>
                <span>&#x2B22;</span>
                <span>&#x2B22;</span>
                <span>&#x2B22;</span>
                <span>&#x2B22;</span>
                <span>&#x2B22;</span>
                <span>&#x2B22;</span>
                <span>&#x2B22;</span>
                <span>&#x2B22;</span>
                <br />
                <span>&#x2B22;</span>
                <span>&#x2B22;</span>
                <span>&#x2B22;</span>
                <span>&#x2B22;</span>
                <span>&#x2B22;</span>
                <span>&#x2B22;</span>
                <span>&#x2B22;</span>
                <span>&#x2B22;</span>
                <span>&#x2B22;</span>
                <span>&#x2B22;</span>
                <span>&#x2B22;</span>
                <span>&#x2B22;</span>

                <br />
                <span>&#x2B22;</span>
                <span>&#x2B22;</span>
                <span>&#x2B22;</span>
                <span>&#x2B22;</span>
                <span>&#x2B22;</span>
                <span>&#x2B22;</span>
                <span>&#x2B22;</span>
                <span>&#x2B22;</span>
                <span>&#x2B22;</span>
                <span>&#x2B22;</span>
                <span>&#x2B22;</span>
                <br />
                <span>&#x2B22;</span>
                <span>&#x2B22;</span>
                <span>&#x2B22;</span>
                <span>&#x2B22;</span>
                <span>&#x2B22;</span>
                <span>&#x2B22;</span>
                <span>&#x2B22;</span>
                <span>&#x2B22;</span>
                <span>&#x2B22;</span>
                <span>&#x2B22;</span>
                <span>&#x2B22;</span>
                <span>&#x2B22;</span>
            </div>
        </section>

        <div id="circle1">
            <div id="inner-cirlce1">
                <h2></h2>
            </div>
        </div>

        <ul>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
        </ul>
    </div>
</template>

<script>
import HttpService from '@/js/axiosConfig';

export default {
    name: 'LoginAdmin',
    methods: {
        btnLogin() {
            HttpService.axiosClient
                .post(`${HttpService.apiUrl}/users/login`, this.userProfile)
                .then((response) => {
                    if (response.metadata.user.role === 'user') {
                        this.$toast.open({
                            message: `You don't have enough permission...`,
                            type: 'error',
                        });
                        return;
                    }
                    HttpService.saveTokens(
                        response.metadata.tokens.accessToken,
                        response.metadata.tokens.refreshToken,
                        response.metadata.user._id,
                    );
                    this.$router.replace('/').catch((err) => {
                        console.error('Lỗi điều hướng: ', err);
                    });
                    setTimeout(() => {
                        location.reload();
                    }, 500);
                    setTimeout(() => {
                        this.showLoadingClient = false;
                    }, 700);
                })
                .catch(() => {
                    this.$toast.open({
                        message: 'Tên dăng nhập hoặc mật khẩu không đúng!',
                        type: 'error',
                    });
                });
        },
    },
    data() {
        return {
            userProfile: {},
        };
    },
};
</script>

<style scoped>
@import url('./login.css');
</style>
