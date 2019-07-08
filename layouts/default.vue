<template>
    <a-layout id="components-layout-demo-custom-trigger">
        <a-layout-sider
            :trigger="null"
            collapsible
            v-model="collapsed">
            <div class="logo"/>
            <a-menu theme="dark" mode="inline" v-model="current">
                <a-menu-item key="dashboard">
                    <n-link to="/">
                        <a-icon type="upload"/>
                        <span>Dashboard</span>
                    </n-link>
                </a-menu-item>
                <a-menu-item key="task">
                    <n-link to="/task">
                        <a-icon type="video-camera"/>
                        <span>Task</span>
                    </n-link>
                </a-menu-item>
                <a-menu-item key="campaign">
                    <n-link to="/campaign">
                        <a-icon type="video-camera"/>
                        <span>Campaign</span>
                    </n-link>
                </a-menu-item>
                <a-menu-item key="crawler">
                    <n-link to="/crawler">
                        <a-icon type="user"/>
                        <span>Crawler</span>
                    </n-link>
                </a-menu-item>
            </a-menu>
        </a-layout-sider>
        <a-layout>
            <a-layout-header style="background: #fff; padding: 0">
                <a-icon
                    class="trigger"
                    :type="collapsed ? 'menu-unfold' : 'menu-fold'"
                    @click="()=> collapsed = !collapsed"
                />
            </a-layout-header>
            <a-layout-content :style="{ margin: '24px 16px', padding: '24px', background: '#fff', height: 'calc(100vh - 112px)' }">
                <nuxt/>
            </a-layout-content>
        </a-layout>
    </a-layout>
</template>
<script>
    export default {
        data() {
            return {
                collapsed: false,
                current: [this.$route.path.substr(1)]

            }
        },
    }
</script>
<style>

</style>
