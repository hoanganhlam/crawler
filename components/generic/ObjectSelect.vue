<template>
    <a-select
        showSearch
        :value="selected"
        placeholder="Select topics"
        style="width: 100%"
        :filterOption="false"
        @search="fetchTopic"
        @change="handleChange"
        :notFoundContent="fetching ? undefined : null">
        <a-spin v-if="fetching" slot="notFoundContent" size="small"/>
        <a-select-option v-for="d in topics" :key="d._id">{{d.title}}</a-select-option>
    </a-select>
</template>

<script>
    import debounce from 'lodash/debounce';

    export default {
        name: "ObjectSelect",
        props: {
            data: {
                type: Object,
                default: null
            }
        },
        data() {
            this.fetchTopic = debounce(this.fetchTopic, 500);
            return {
                topics: [],
                fetching: false,
                visible: false,
                topicName: null,
                selected: []
            }
        },
        methods: {
            fetchTopic(value) {
                this.topics = []
                this.fetching = true
                this.$axios.$get('/campaigns/', {
                    params: {search: value}
                }).then(res => {
                    this.topics = res.results
                    this.fetching = false
                })
            },
            handleChange(selected) {
                this.selected = selected
                console.log(selected);
                this.$emit('selected', selected)
            }
        },
        created() {
            if (this.data) {
                this.topics = [this.data]
                this.selected = [this.data._id]
            }
        }
    }
</script>

<style scoped>

</style>
