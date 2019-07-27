<template>
    <a-card title="SETTING" :bodyStyle="{padding: '10px',height: '652px'}">
        <a-form layout="horizontal" v-if="value && form">
            <a-row :gutter="16">
                <a-col :span="12">
                    <a-form-item v-if="!value.hasOwnProperty('tasks')" label="Key" :label-col="formLayout.labelCol"
                                 :wrapper-col="formLayout.wrapperCol">
                        <a-input v-model="form.key">
                            <a-icon style="cursor: pointer" @click="$emit('delete', form.key)"
                                    slot="addonAfter"
                                    type="delete"></a-icon>
                        </a-input>
                    </a-form-item>
                    <a-form-item label="Title" :label-col="formLayout.labelCol" :wrapper-col="formLayout.wrapperCol">
                        <a-input v-model="form.title"/>
                    </a-form-item>
                    <a-form-item label="Type" v-if="!value.hasOwnProperty('tasks')"
                                 :label-col="formLayout.labelCol"
                                 :wrapper-col="formLayout.wrapperCol">
                        <a-switch v-model="isLoop" checkedChildren="Loop" unCheckedChildren="Action" defaultChecked/>
                    </a-form-item>
                    <div v-if="!value.hasOwnProperty('tasks')">
                        <a-form-item v-if="isLoop" label="Loop" :label-col="formLayout.labelCol"
                                     :wrapper-col="formLayout.wrapperCol">
                            <a-select
                                v-model="form.loop"
                                showSearch
                                placeholder="Chọn thao tác"
                                optionFilterProp="children"
                                style="width: 200px">
                                <a-select-option value="SINGLE">Đơn</a-select-option>
                                <a-select-option value="PAGING">Phân trang</a-select-option>
                                <a-select-option value="LAZY">Lazyload</a-select-option>
                                <a-select-option value="ARRAY">Danh sách</a-select-option>
                            </a-select>
                        </a-form-item>
                        <a-form-item v-else label="action" :label-col="formLayout.labelCol"
                                     :wrapper-col="formLayout.wrapperCol">
                            <a-select
                                v-model="form.action"
                                showSearch
                                placeholder="Chọn thao tác"
                                optionFilterProp="children">
                                <a-select-option value="GOTO">Đi đến</a-select-option>
                                <a-select-option value="CLICK">Nhập chuột</a-select-option>
                                <a-select-option value="EXTRACT">Tách dữ liệu</a-select-option>
                                <a-select-option value="BACK">Quay lại</a-select-option>
                                <a-select-option value="INPUT">Nhập nội dung</a-select-option>
                            </a-select>
                        </a-form-item>
                    </div>
                    <div v-else>
                        <a-form-item label="Campaign" :label-col="formLayout.labelCol"
                                     :wrapper-col="formLayout.wrapperCol">
                            <ObjectSelect @selected="form.campaign = $event" :data="form.campaign"/>
                        </a-form-item>
                        <a-form-item label="Type"
                                     :label-col="formLayout.labelCol"
                                     :wrapper-col="formLayout.wrapperCol">
                            <a-select v-model="form.crawlType" placeholder="Select Type" style="width: 100%">
                                <a-select-option value="HEADLESS">
                                    HEADLESS
                                </a-select-option>
                                <a-select-option value="NOHEADLESS">
                                    NOHEADLESS
                                </a-select-option>
                                <a-select-option value="API">
                                    API
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                        <a-form-item label="Schedule" :label-col="formLayout.labelCol"
                                     :wrapper-col="formLayout.wrapperCol">
                            <a-input v-model="form.options.schedule"/>
                        </a-form-item>
                    </div>
                </a-col>
                <a-col :span="12" v-if="!value.hasOwnProperty('tasks')">
                    <a-form-item label="Max Page" v-if="form.loop"
                                 :label-col="formLayout.labelCol"
                                 :wrapper-col="formLayout.wrapperCol">
                        <a-input v-model="form.maxPage"/>
                    </a-form-item>
                    <a-form-item label="Target" :label-col="formLayout.labelCol" :wrapper-col="formLayout.wrapperCol">
                        <a-input v-model="form.target"/>
                    </a-form-item>
                    <a-form-item label="Text" v-if="!isLoop && form.action === 'INPUT'"
                                 :label-col="formLayout.labelCol"
                                 :wrapper-col="formLayout.wrapperCol">
                        <a-input v-model="form.text"/>
                    </a-form-item>
                    <a-form-item label="Save field" v-if="!isLoop && form.action === 'EXTRACT'"
                                 :label-col="formLayout.labelCol" :wrapper-col="formLayout.wrapperCol">
                        <a-input v-model="form.field"></a-input>
                    </a-form-item>
                    <a-form-item label="Control" v-if="!isLoop && form.action === 'EXTRACT'"
                                 :label-col="formLayout.labelCol" :wrapper-col="formLayout.wrapperCol">
                        <a-row :gutter="15">
                            <a-col :md="12">
                                <a-switch v-model="form.stop" checkedChildren="Stop" unCheckedChildren="Stop"/>
                            </a-col>
                        </a-row>
                    </a-form-item>
                    <a-form-item label="List" v-if="isLoop && form.loop === 'ARRAY'">
                        <a-input :autosize="{ minRows: 12 }" type="textarea" v-model="arrStr"/>
                    </a-form-item>
                    <div v-if="!isLoop && form.action === 'GOTO'">
                        <a-form-item label="Params" :label-col="formLayout.labelCol"
                                     :wrapper-col="formLayout.wrapperCol">
                            <a-row class="bt-16" v-for="(param, i) in form.options.params" :key="i">
                                <a-col :span="12">
                                    <a-input placeholder="Key" v-model="param.key"/>
                                </a-col>
                                <a-col :span="12">
                                    <a-input placeholder="Value" v-model="param.value"/>
                                </a-col>
                                <a-button size="small" class="abs-delete ant-btn-circle"
                                          @click="form.options.params.splice(i, 1)">
                                    <a-icon class="" type="minus-circle-o"/>
                                </a-button>
                            </a-row>
                            <a-row>
                                <a-button type="dashed" style="width: 100%" @click="addParam">
                                    <a-icon type="plus"/>
                                    Add field
                                </a-button>
                            </a-row>
                        </a-form-item>
                    </div>
                </a-col>
            </a-row>
            <a-form-item label="Fields" v-if="!value.hasOwnProperty('tasks') && form.action==='EXTRACT'">
                <a-table :pagination="false" class="bt-16" :columns="columns" :dataSource="form.fields"
                         rowKey="key">
                    <template slot="key" slot-scope="text, record">
                        <a-input v-model="record.key"></a-input>
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
                            @confirm="() => onDelete(record.key)">
                            <a href="javascript:;">Delete</a>
                        </a-popconfirm>
                    </template>
                </a-table>
                <a-select v-model="selectedKey" mode="multiple" placeholder="Select field from campaign"
                          style="width: 100%"
                          @change="handleChange">
                    <a-select-option v-for="field in fields" :key="field.key">
                        {{field.title}}
                    </a-select-option>
                </a-select>
            </a-form-item>
        </a-form>
    </a-card>
</template>

<script>
    import ObjectSelect from '../../components/generic/ObjectSelect'

    const columns = [
        {
            dataIndex: 'key',
            key: 'key',
            slots: {title: 'Key'},
            scopedSlots: {customRender: 'key'},
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
        }
    ];

    export default {
        name: "Setting",
        components: {
            ObjectSelect
        },
        props: {
            value: {
                type: Object,
                default: null
            },
            fields: {
                type: Array,
                default: () => {
                    return []
                }
            }
        },
        data() {
            return {
                form: this.value,
                formLayout: {
                    labelCol: {span: 6},
                    wrapperCol: {span: 14},
                },
                columns,
                isLoop: false,
                arrStr: this.value.urls ? this.value.urls.join('\n') : '',
                selectedKey: []
            }
        },
        methods: {
            onDelete(key) {
                const dataSource = [...this.form.fields]
                this.form.fields = dataSource.filter(item => item.key !== key)
            },

            handleChange(keys) {
                this.selectedKey = keys
            },
            addParam() {
                this.form.options.params.push({
                    key: null,
                    value: null
                })
            },
        },
        watch: {
            value() {
                this.form = this.value
                this.isLoop = this.value.loop !== null;
                this.arrStr = this.value.urls ? this.value.urls.join('\n') : ''
                if (typeof this.value.options === 'undefined') {
                    this.form.options = {
                        params: []
                    }
                }
            },
            isLoop() {

            },
            arrStr() {
                if (this.arrStr) {
                    this.form.urls = this.arrStr.split('\n')
                }
            },
            selectedKey() {
                this.selectedKey.forEach(
                    key => {
                        if (this.form.fields.map(x => x.key).indexOf(key) === -1) {
                            this.form.fields.push({
                                key: key,
                                attr: 'innerHTML',
                                path: null
                            })
                        }
                    }
                )
            },
        },
        mounted() {
        }
    }
</script>

<style scoped>

</style>
