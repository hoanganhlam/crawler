<template>
    <div class="task-panel">
        <a-row :gutter="16">
            <a-col :span="8" class="sub-panel">
                <Logic :value="form.tasks" @select="onSelect">
                    <div class="action-bar">
                        <a-row>
                            <a-col :span="12">
                                <a-button icon="plus" @click="onAdd"/>
                            </a-col>
                            <a-col :span="12" style="text-align: right">
                                <a-button v-if="value" icon="delete" @click="onDelete(value._id)"/>
                                <a-button icon="play-circle" @click="onPlay"/>
                                <a-button icon="upload" @click="onPost"/>
                            </a-col>
                        </a-row>
                    </div>
                </Logic>
            </a-col>
            <a-col :span="16" class="sub-panel">
                <Setting v-model="selectedNode"/>
            </a-col>
        </a-row>
        <a-row>
            <a-col :span="24" class="sub-panel">
                <a-card :bodyStyle="{padding: '10px'}" title="CONSOLE">
                </a-card>
            </a-col>
        </a-row>
    </div>
</template>

<script>
    import Logic from './Logic'
    import Setting from './Setting'

    const SAMPLE = {
        title: "Lấy tin tức du lịch từ VNExpress",
        isLoop: false,
        schedule: "",
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
                target: ".mnu_dulich",
            },
            {
                //Đoạn này t cần logic loop lấy hết các page pagination
                key: '3',
                title: "Lấy hết các phân trang",
                action: "CLICK",
                target: ".next",
                isLoop: true,
                // Có thể loop dự vào element của trang (single) hoặc một list các url (list)
                loopModel: "single",
                children: [
                    {
                        key: '31',
                        title: "Bóc tách dữ liệu",
                        action: "EXTRACT",
                        fields: [
                            {
                                field: 'title',
                                path: '.title_news',

                            },
                            {
                                field: 'url',
                                path: '.title_news',

                            },
                            {
                                field: 'description',
                                path: '.description',

                            }
                        ]
                    }
                ]
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
                selectedNode: null
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
                        this.$router.replace({path: `/task/${res.body._id}`})
                    })
                } else {
                    this.$axios.$post('/tasks/', this.form).then(res => {
                        this.$router.replace({path: `/task/${res.body._id}`})
                    })
                }
            },
            onPlay() {

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
        }
    }
</script>

<style lang="scss">

</style>
