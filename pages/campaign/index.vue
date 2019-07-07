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
            <a-sub-menu>
                <span slot="title" class="submenu-title-wrapper"><a-icon
                    type="setting"/>Navigation Three - Submenu</span>
                <a-menu-item-group title="Item 1">
                    <a-menu-item key="setting:1">Option 1</a-menu-item>
                    <a-menu-item key="setting:2">Option 2</a-menu-item>
                </a-menu-item-group>
                <a-menu-item-group title="Item 2">
                    <a-menu-item key="setting:3">Option 3</a-menu-item>
                    <a-menu-item key="setting:4">Option 4</a-menu-item>
                </a-menu-item-group>
            </a-sub-menu>
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
