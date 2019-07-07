<template>
    <div>
        <a-menu v-model="current" mode="horizontal">
            <a-menu-item key="mail">
                <a-icon type="mail"/>
                Overview
            </a-menu-item>
            <a-menu-item key="app">
                <a-icon type="appstore"/>
                Task
            </a-menu-item>
        </a-menu>
    </div>
</template>

<script>
    export default {
        name: "Campaign",
        data() {
            return {
                current: ['mail'],
            }
        },
    }
</script>

<style scoped>

</style>
