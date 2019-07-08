<template>
    <a-card :bodyStyle="{padding: '10px'}" title="LOGIC">
        <a-switch slot="extra" v-model="isEditor" defaultChecked>
            <a-icon type="check" slot="checkedChildren"/>
            <a-icon type="close" slot="unCheckedChildren"/>
        </a-switch>
        <v-jsoneditor v-if="isEditor" v-model="structure" :plus="false" height="230px" @error="onError"></v-jsoneditor>
        <a-tree
            v-else
            :defaultExpandAll="true"
            :treeData="structure"
            optionFilterProp="STEPS"
            @select="this.onSelect"
            @check="this.onCheck"
        >
        </a-tree>
        <slot class="action-bar"></slot>
    </a-card>
</template>
<script>
    export default {
        props: {
            value: {}
        },
        data() {
            return {
                structure: this.value,
                isEditor: false
            }
        },
        methods: {
            onSelect(selectedKeys, info) {
                this.$emit('select', selectedKeys[0])
            },
            onCheck(checkedKeys, info) {
                console.log('onCheck', checkedKeys, info)
            },
            onError(err) {
                console.log(err);
            }
        },
        updated() {
            this.$emit('input', this.structure)
        }
    }

</script>

