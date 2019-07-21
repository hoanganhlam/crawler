<template>
    <div class="page_task">
        <a-menu v-model="current" mode="horizontal">
            <a-menu-item key="a">
                <a-select
                    showSearch
                    placeholder="Select crawler"
                    optionFilterProp="children"
                    style="width: 200px">
                    <a-select-option value="jack">Jack</a-select-option>
                    <a-select-option value="lucy">Lucy</a-select-option>
                    <a-select-option value="tom">Tom</a-select-option>
                </a-select>
            </a-menu-item>
            <a-menu-item key="b">
                <ObjectSelect/>
            </a-menu-item>
        </a-menu>
        <a-menu v-model="current" mode="horizontal">
            <a-menu-item v-for="t in tasks" :key="`/task/${t._id}`">
                <n-link :to="`/task/${t._id}`">
                    <a-icon type="ordered-list"/>
                    {{t.title}}
                </n-link>
            </a-menu-item>
            <a-menu-item key="/task/">
                <n-link :to="`/task/`">
                    <a-icon type="plus"/>
                </n-link>
            </a-menu-item>
        </a-menu>
        <div class="main" style="padding-top: 16px">
            <Builder :value="task"/>
        </div>
    </div>
</template>

<script>
    import Builder from '../../components/Task/Builder'
    import TaskDetail from '../../components/Task/Detail'
    import TaskImport from '../../components/Task/Import'
    import ObjectSelect from '../../components/generic/ObjectSelect'

    export default {
        name: "task",
        data() {
            let current = [this.$route.path]
            return {
                current
            }
        },
        head() {
            return {
                title: 'Task'
            }
        },
        async asyncData({app, params}) {
            let res = await app.$axios.$get('/tasks')

            let task = null
            if (params.path) {
                let res2 = await app.$axios.$get(`/tasks/${params.path}`)
                task = res2.body
            }
            return {
                tasks: res.body,
                task,
            }
        },
        components: {
            Builder, TaskImport, TaskDetail, ObjectSelect
        }
    }
</script>

<style lang="scss">

</style>
