<template>
    <div class="task-panel">
        <a-row :gutter="16" class="bt-16">
            <a-col :span="10" class="sub-panel">
                <Logic class="bt-16" :value="form.tasks" @select="onSelect" @input="form.tasks = $event">
                    <div class="action-bar">
                        <a-row>
                            <a-col :span="12">
                                <a-button icon="plus" @click="onAdd"/>
                            </a-col>
                            <a-col :span="12" style="text-align: right">
                                <span v-if="value">
                                    <a-popconfirm title="Are you sure delete this task?"
                                                  @confirm="onDelete(value._id)"
                                                  okText="Yes" cancelText="No">
                                        <a-button icon="delete"/>
                                    </a-popconfirm>
                                    <a-tooltip placement="topLeft" title="Run test">
                                        <a-button icon="play-circle" @click="onPlay(value._id, true)"/>
                                    </a-tooltip>
                                    <a-tooltip placement="topLeft" title="Run & save data">
                                        <a-button icon="play-circle" @click="onPlay(value._id, false)"/>
                                    </a-tooltip>
                                </span>
                                <a-button icon="upload" @click="onPost"/>
                            </a-col>
                        </a-row>
                    </div>
                </Logic>
                <a-card :bodyStyle="{padding: '10px'}" :title="`CONSOLE (${consoleDisplay.length})`">
                    <a-button slot="extra" size="small" @click="consoleDisplay = []">
                        <a-icon type="sync"></a-icon>
                    </a-button>
                    <div>
                        <div v-for="(display, id) in consoleDisplay" :key="id"
                             style="margin-bottom: 5px"
                             class="ant-alert ant-alert-info">
                            <div class="ant-alert-message">
                                <div v-for="field in Object.keys(display)" :key="id + field">
                                    {{field}} : {{display[field]}}
                                </div>
                            </div>
                            <span class="ant-alert-description"></span>
                        </div>
                    </div>
                </a-card>
            </a-col>
            <a-col :span="14" class="auto-size">
                <Setting v-model="selectedNode" @delete="deleteNode"
                         :fields="form.campaign ? form.campaign.fields : []"/>
            </a-col>
        </a-row>
    </div>
</template>

<script>
    import Logic from './Logic'
    import Setting from './Setting'
    import io from 'socket.io-client'

    const SAMPLE_TASK = {
        title: null,
        campaign: null,
        tasks: [],
        // NOHEADLESS, API, HEADLESS
        crawlType: 'NOHEADLESS',
        options: {
            apiKey: null,
            apiQuery: null,
            schedule: null
        }
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

    function deleteTree(arr, key) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].key === key) {
                arr = arr.splice(i, 1)
            } else if (arr[i].children && arr[i].children.length) {
                deleteTree(arr[i].children, key);
            }
        }
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
                form: this.value ? this.value : SAMPLE_TASK,
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
            onPlay(id, test) {
                this.$axios.$post(`/run/`, {
                    id: id,
                    isTest: test
                })
            },
            onAdd() {
                this.form.tasks.push({
                    key: (this.form.tasks.length + 1).toString(),
                    title: 'Step ' + (this.form.tasks.length + 1).toString(),
                    action: null,
                    loop: null,
                    fields: [],
                    urls: [],
                    options: {
                        stop: false,
                        maxPage: 0,
                        loopTarget: null,
                        actionTarget: null,
                        actionSource: 'http',
                        field: null,
                        loopKey: null,
                        params: [],
                        extractKey: null,
                        targetType: 'css'
                    }
                })
            },
            onDelete(id) {
                this.$axios.delete(`/tasks/${id}/`).then(res => {
                    this.$router.replace({path: '/task/'})
                })
            },
            deleteNode(key) {
                deleteTree(this.form.tasks, key)
                this.selectedNode = this.form
            }
        },
        created() {
            this.selectedNode = this.form
            if (typeof this.form.options === 'undefined') {
                this.form.options = {
                    schedule: null
                }
            }
        },
        mounted() {
            this.socket.on('data', (data) => {
                this.consoleDisplay.unshift(data)
            })
            this.socket.on('error', (data) => {
                this.consoleDisplay.unshift(data)
            })
        },
    }
</script>

<style lang="scss">

</style>
