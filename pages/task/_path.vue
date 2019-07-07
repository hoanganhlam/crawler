<template>
    <div>
        <a-menu v-model="current" mode="horizontal">
            <a-menu-item key="0">
                <a-icon type="ordered-list" />All
            </a-menu-item>
            <a-menu-item key="1">
                <a-icon type="plus" />Task builder
            </a-menu-item>
            <a-menu-item key="2">
                <a-icon type="upload" />Import
            </a-menu-item>
        </a-menu>
    </div>
</template>

<script>
    export default {
        name: "task",
        data () {
            return {
                current: ['0'],
            }
        },
    }
</script>

<style scoped>

</style>
