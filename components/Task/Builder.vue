<template>
    <div class="task-panel">
        <a-row :gutter="16" class="bt-16">
            <a-col :span="12" class="sub-panel">
                <Logic :value="form.tasks" @select="onSelect">
                    <div class="action-bar">
                        <a-row>
                            <a-col :span="12">
                                <a-button icon="plus" @click="onAdd"/>
                            </a-col>
                            <a-col :span="12" style="text-align: right">
                                <a-button v-if="value" icon="delete" @click="onDelete(value._id)"/>
                                <a-button v-if="value" icon="play-circle" @click="onPlay(value._id)"/>
                                <a-button icon="upload" @click="onPost"/>
                            </a-col>
                        </a-row>
                    </div>
                </Logic>
            </a-col>
            <a-col :span="12" class="sub-panel">
                <Setting v-model="selectedNode"/>
            </a-col>
        </a-row>
        <a-row>
            <a-col :span="24" class="sub-panel">
                <a-card :bodyStyle="{padding: '10px'}" :title="`CONSOLE (${consoleDisplay.length - 1})`">
                    <div v-for="display, id in consoleDisplay" :key="id"
                         style="margin-bottom: 5px"
                         class="ant-alert ant-alert-info">
                        <div class="ant-alert-message">
                            <div v-for="field in Object.keys(display)" :key="id + field">
                                {{field}} : {{display[field]}}
                            </div>
                        </div>
                        <span class="ant-alert-description"></span>
                    </div>
                </a-card>
            </a-col>
        </a-row>
    </div>
</template>

<script>
    import Logic from './Logic'
    import Setting from './Setting'
    import io from 'socket.io-client'

    const SAMPLE = {
        title: "Lấy tin tức du lịch từ VNExpress",
        isLoop: false,
        schedule: "",
        isHeadless: false,
        tasks: [
            {
                key: '1',
                title: "Đến trang chủ",
                action: "GOTO",
                target: "https://vnexpress.net/",
            },
            {
                key: '2',
                title: "Đến danh mục du lịch",
                action: "CLICK",
                target: "#main_menu > a.mnu_dulich",
            },
            {
                key: '3',
                title: "Lấy hết các phân trang",
                target: ".next",
                loop: "PAGING",
                children: [{
                    key: '31',
                    title: "Bóc tách dữ liệu",
                    action: "EXTRACT",
                    target: "#col_sticky > article",
                    fields: [{
                        field: 'title',
                        attr: 'innerHTML',
                        path: 'a',

                    },
                        {
                            field: 'url',
                            attr: 'href',
                            path: 'a',

                        },
                        {
                            field: 'description',
                            attr: 'innerHTML',
                            path: '.description',

                        }
                    ]
                }]
            }
        ]
    }

    function searchTree(arr, key) {
        let i;
        let result = null;
        for (i = 0; result == null && i < arr.length; i++) {
            if (arr[i].key === key) {
                return arr[i];
            } else if (arr[i].children && arr[i].children.length) {
                result = searchTree(arr[i].children, key);
            }
        }
        return result;
    }

    export default {
        name: "Builder",
        components: {
            Logic,
            Setting
        },
        props: ['value'],
        data() {
            return {
                form: this.value ? this.value : SAMPLE,
                selectedNode: null,
                socket: io(`${process.env.WS_URL}`),
                consoleDisplay: []
            }
        },
        methods: {
            onSelect(key) {
                let node = searchTree(this.form.tasks, key)
                if (node) {
                    this.selectedNode = searchTree(this.form.tasks, key);
                } else {
                    this.selectedNode = this.form
                }
            },
            onPost() {
                if (this.value) {
                    this.$axios.put(`/tasks/${this.value._id}/`, this.form).then(res => {
                        this.$router.replace({path: `/task/${this.value._id}`})
                    })
                } else {
                    this.$axios.$post('/tasks/', this.form).then(res => {
                        this.$router.replace({path: `/task/${res.body._id}`})
                    })
                }
            },
            onPlay(id) {
                this.$axios.$post(`/run/`, {
                    id: id
                })
            },
            onAdd() {

            },
            onDelete(id) {
                this.$axios.delete(`/tasks/${id}/`).then(res => {
                    this.$router.replace({path: '/task/'})
                })
            }
        },
        created() {
            this.selectedNode = this.form
        },
        mounted() {
            this.socket.on('data', (data) => {
                this.consoleDisplay.unshift(data)
            })
        },
    }
</script>

<style lang="scss">

</style>
