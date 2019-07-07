<template>
    <div class="task-panel">
        <a-row :gutter="16">
            <a-col :span="8" class="sub-panel">
                <a-card :bodyStyle="{padding: '10px'}">
                    <h4>LOGIC</h4>
                </a-card>
            </a-col>
            <a-col :span="16" class="sub-panel">
                <a-card :bodyStyle="{padding: '10px'}">
                    <h4>SETTING</h4>
                </a-card>
            </a-col>
        </a-row>
        <a-row>
            <a-col :span="24" class="sub-panel">
                <a-card :bodyStyle="{padding: '10px'}">
                    <h4>LOG</h4>
                </a-card>
            </a-col>
        </a-row>
    </div>
</template>

<script>
    export default {
        name: "Builder",
        data() {
            return {
                structure: {}
            }
        }
    }
</script>

<style lang="scss">

</style>
