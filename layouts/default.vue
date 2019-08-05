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
                <a-menu-item key="ccc">
                    <div v-if="!$auth.loggedIn" style="float: right;margin-right: 1rem;">
                        <a-button @click="visible = true" type="primary">
                            <a-icon type="edit"/>
                            Đăng nhập
                        </a-button>
                    </div>
                </a-menu-item>
                <a-menu-item>
                    <a-icon
                        class="trigger"
                        :type="collapsed ? 'menu-unfold' : 'menu-fold'"
                        @click="()=> collapsed = !collapsed"
                    />
                </a-menu-item>
            </a-menu>
        </a-layout-sider>
        <a-layout>
            <a-layout-content
                :style="{padding: '24px', background: '#fff', minHeight: 'calc(100vh - 0px)' }">
                <nuxt/>
            </a-layout-content>
        </a-layout>
        <a-drawer
            title="Đăng nhập hệ thống"
            :width="520"
            :visible="visible"
            @close="visible = false"
            :wrapStyle="{overflow: 'auto'}">
            <Login @done="visible = false"/>
        </a-drawer>
    </a-layout>
</template>
<script>
    import Login from '../components/Login'

    export default {
        components: {
            Login
        },
        data() {
            return {
                visible: false,
                collapsed: false,
                current: [this.$route.path.substr(1)]

            }
        },
    }
</script>
<style>

</style>
