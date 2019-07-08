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
                    <a-form-item v-if="value.hasOwnProperty('tasks')" label="Schedule" :label-col="formLayout.labelCol" :wrapper-col="formLayout.wrapperCol">
                        <a-input v-model="form.schedule"/>
                    </a-form-item>
                    <a-form-item v-if="!value.hasOwnProperty('tasks')" label="action" :label-col="formLayout.labelCol" :wrapper-col="formLayout.wrapperCol">
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
                    <a-form-item v-if="form.isLoop" label="Stop condition" :label-col="formLayout.labelCol"
                                 :wrapper-col="formLayout.wrapperCol">
                        <a-input v-model="form.stopCondition"/>
                    </a-form-item>
                    <a-form-item v-if="form.isLoop" label="Scroll" :label-col="formLayout.labelCol" :wrapper-col="formLayout.wrapperCol">
                        <a-switch v-model="form.scrollDown">
                            <a-icon type="check" slot="checkedChildren"/>
                            <a-icon type="close" slot="unCheckedChildren"/>
                        </a-switch>
                    </a-form-item>
                    <a-form-item label="Target" :label-col="formLayout.labelCol" :wrapper-col="formLayout.wrapperCol">
                        <a-input v-model="form.target"/>
                    </a-form-item>
                    <a-form-item label="Field" :label-col="formLayout.labelCol" :wrapper-col="formLayout.wrapperCol">
                        <a-input v-model="form.field"/>
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
    </a-card>
</template>

<script>
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
            }
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
