<template>
    <a-card title="SETTING" :bodyStyle="{padding: '10px'}">
        <a-form layout="horizontal" v-if="value && form">
            <a-row :gutter="16">
                <a-col :span="12">
                    <a-form-item label="Title" :label-col="formLayout.labelCol" :wrapper-col="formLayout.wrapperCol">
                        <a-input v-model="form.title"/>
                    </a-form-item>
                    <a-form-item label="Loop" :label-col="formLayout.labelCol" :wrapper-col="formLayout.wrapperCol">
                        <a-select
                            v-model="form.loop"
                            showSearch
                            placeholder="Chọn thao tác"
                            optionFilterProp="children"
                            style="width: 200px">
                            <a-select-option value="SINGLE">Đơn</a-select-option>
                            <a-select-option value="PAGING">Phân trang</a-select-option>
                            <a-select-option value="LAZY">Lazyload</a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item v-if="value.hasOwnProperty('tasks')" label="Schedule" :label-col="formLayout.labelCol"
                                 :wrapper-col="formLayout.wrapperCol">
                        <a-input v-model="form.schedule"/>
                    </a-form-item>
                    <a-form-item v-if="!value.hasOwnProperty('tasks')" label="action" :label-col="formLayout.labelCol"
                                 :wrapper-col="formLayout.wrapperCol">
                        <a-select
                            v-model="form.action"
                            showSearch
                            placeholder="Chọn thao tác"
                            optionFilterProp="children"
                            style="width: 200px">
                            <a-select-option value="GOTO">Đi đến</a-select-option>
                            <a-select-option value="CLICK">Nhập chuột</a-select-option>
                            <a-select-option value="EXTRACT">Tách dữ liệu</a-select-option>
                            <a-select-option value="BACK">Quay lại</a-select-option>
                            <a-select-option value="INPUT">Nhập nội dung</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="12" v-if="!value.hasOwnProperty('tasks')">
                    <a-form-item v-if="form.loop" label="Max Page" :label-col="formLayout.labelCol"
                                 :wrapper-col="formLayout.wrapperCol">
                        <a-input v-model="form.maxPage"/>
                    </a-form-item>
                    <a-form-item label="Target" :label-col="formLayout.labelCol" :wrapper-col="formLayout.wrapperCol">
                        <a-input v-model="form.target"/>
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
        <div v-if="!value.hasOwnProperty('tasks') && form.action==='EXTRACT'">
            <a-table :columns="columns" :dataSource="form.fields">
                <template slot="field" slot-scope="text, record">
                    <a-input v-model="record.field"></a-input>
                </template>
                <template slot="path" slot-scope="text, record">
                    <a-input v-model="record.path"></a-input>
                </template>
                <template slot="attr" slot-scope="text, record">
                    <a-input v-model="record.attr"></a-input>
                </template>
                <template slot="operation" slot-scope="text, record">
                    <a-popconfirm
                        v-if="form.fields"
                        title="Sure to delete?"
                        @confirm="() => onDelete(record.field)">
                        <a href="javascript:;">Delete</a>
                    </a-popconfirm>
                </template>
            </a-table>
            <a-button class="editable-add-btn" @click="handleAdd">Add</a-button>
        </div>
    </a-card>
</template>

<script>

    const columns = [
        {
            dataIndex: 'field',
            key: 'field',
            slots: {title: 'Field'},
            scopedSlots: {customRender: 'field'},
        }, {
            dataIndex: 'path',
            key: 'path',
            slots: {title: 'Path'},
            scopedSlots: {customRender: 'path'},
        }, {
            dataIndex: 'attr',
            key: 'attr',
            slots: {title: 'Position'},
            scopedSlots: {customRender: 'attr'},
        }, {
            dataIndex: 'operation',
            scopedSlots: {customRender: 'operation'},
        }];

    export default {
        name: "Setting",
        props: {
            value: {
                type: Object,
                default: null
            }
        },
        data() {
            return {
                form: this.value,
                formLayout: {
                    labelCol: {span: 6},
                    wrapperCol: {span: 14},
                },
                columns
            }
        },
        methods: {
            handleAdd() {
                const newData = {
                    field: `null`,
                    path: null,
                    attr: `innerHTML`,
                }
                this.form.fields = [...this.form.fields, newData]
            },
            onDelete(field) {
                const dataSource = [...this.form.fields]
                this.form.fields = dataSource.filter(item => item.field !== field)
            },
        },
        watch: {
            value() {
                this.form = this.value
            }
        }
    }
</script>

<style scoped>

</style>
