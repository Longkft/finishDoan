<template>
    <div class="main" id="main">
        <HeaderAdmin></HeaderAdmin>
        <BodyAdmin></BodyAdmin>
    </div>
</template>

<script>
import HeaderAdmin from '../home/header/HeaderAdmin.vue';
import BodyAdmin from '../home/body/BodyAdmin.vue';
export default {
    name: 'ContentAdmin',
    components: { HeaderAdmin, BodyAdmin },
};
</script>

<style></style>
