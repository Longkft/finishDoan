<template>
    <div class="topbar">
        <div class="toggle">
            <font-awesome-icon class="ion-icon" :icon="['fas', 'bars']" />
        </div>

        <div class="user">
            <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSf8LZk98dkqzBdcXuQ4OhFcAg4Oiv6Gye9DQ&s"
                alt=""
            />
        </div>
    </div>
</template>
<script>
import moment from 'moment';
import 'moment/locale/vi';
moment.locale('vi');

export default {
    name: 'HeaderAdmin',
    methods: {},

    data() {
        return {};
    },
};
</script>
<style scoped>
@import url(./header.css);
.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
}

.header-left {
    display: flex;
    align-items: center;
    column-gap: 24px;
}

.name-company select {
    background-color: transparent;
    border: none;
    outline: none;
    color: #212121;
    font-weight: 500;
}

.header-right {
    display: flex;
    align-items: center;
    column-gap: 24px;
}

.isDisplayNotif {
    visibility: visible;
    opacity: 0;
    display: none;
}
</style>
