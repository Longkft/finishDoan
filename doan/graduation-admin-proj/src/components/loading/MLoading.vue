<template>
    <tr v-for="index in 10" :key="index">
        <td v-if="hasCheckbox">
            <div class="loading"></div>
        </td>
        <template v-for="(col, indexCol) in titleTable" :key="indexCol">
            <td :class="col.className"><div class="loading"></div></td>
        </template>
        <td class="br-none" v-if="hasWiget">
            <div class="loading"></div>
        </td>
    </tr>
</template>

<script>
export default {
    name: 'MLoading',
    props: {
        hasWiget: {
            type: Boolean,
        },
        hasCheckbox: {
            type: Boolean,
        },
        titleTable: {
            type: Array,
        },
    },
};
</script>

<style scoped>
@import url('./loading.css');
@import url('../table/table.css');
</style>
