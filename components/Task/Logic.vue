<template>
    <a-card :bodyStyle="{padding: '10px'}" title="LOGIC">
        <a-switch slot="extra" v-model="isEditor" defaultChecked>
            <a-icon type="check" slot="checkedChildren"/>
            <a-icon type="close" slot="unCheckedChildren"/>
        </a-switch>
        <v-jsoneditor v-if="isEditor" v-model="structure" :plus="false" height="230px" @error="onError"></v-jsoneditor>
        <a-tree
            v-else
            :draggable="true"
            @dragenter="onDragEnter"
            @drop="onDrop"
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
            },
            onDragEnter(info) {
                console.log(info)
            },
            onDrop(info) {
                console.log(info)
                const dropKey = info.node.eventKey
                const dragKey = info.dragNode.eventKey
                const dropPos = info.node.pos.split('-')
                const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1])
                const loop = (data, key, callback) => {
                    data.forEach((item, index, arr) => {
                        if (item.key === key) {
                            return callback(item, index, arr)
                        }
                        if (item.children) {
                            return loop(item.children, key, callback)
                        }
                    })
                }
                const data = [...this.structure]

                let dragObj
                loop(data, dragKey, (item, index, arr) => {
                    arr.splice(index, 1)
                    dragObj = item
                })
                if (!info.dropToGap) {
                    loop(data, dropKey, (item) => {
                        item.children = item.children || [];
                        item.children.push(dragObj);
                    });
                } else if (
                    (info.node.children || []).length > 0
                    && info.node.expanded
                    && dropPosition === 1
                ) {
                    loop(data, dropKey, (item) => {
                        item.children = item.children || [];
                        item.children.unshift(dragObj);
                    });
                } else {
                    let ar;
                    let i;
                    loop(data, dropKey, (item, index, arr) => {
                        ar = arr;
                        i = index;
                    });
                    if (dropPosition === -1) {
                        ar.splice(i, 0, dragObj);
                    } else {
                        ar.splice(i + 1, 0, dragObj);
                    }
                }
                this.structure = data
            }
        },
        updated() {
            this.$emit('input', this.structure)
        },
        watch: {
            value() {
                this.structure = this.value
            }
        }
    }

</script>

