<template>
    <div>
        <a-menu class="bt-16" v-model="current" mode="horizontal">
            <a-menu-item v-for="t in campaigns.results" :key="`/campaign/${t._id}`">
                <n-link :to="`/campaign/${t._id}`">
                    {{t.title}}
                </n-link>
            </a-menu-item>
            <a-menu-item key="/campaign/">
                <n-link :to="`/campaign/`">
                    <a-icon type="plus"/>
                </n-link>
            </a-menu-item>
        </a-menu>
        <a-row v-if="campaign === null" type="flex" justify="space-around" align="middle" style="min-height: 600px;">
            <a-col :span="4">
                <a-form-item label="New">
                    <a-input size="large" placeholder="Campaign name" v-model="campaignName"/>
                </a-form-item>
                <a-button class="fullwidth" @click="createCampaign()">Save</a-button>
            </a-col>
        </a-row>
        <div v-if="campaign">
            <div class="bt-16">
                <a-row :gutter="16">
                    <a-col class="bt-16" v-for="field in campaign.fields" :key="field.key" :md="4">
                        <a-card>
                            <a-input class="bt-16" v-model="field.title" @blur="updateCampaign"/>
                            <a-input v-model="field.key" @blur="updateCampaign"/>
                        </a-card>
                    </a-col>
                    <a-col :md="4">
                        <a-card>
                            <a-input class="bt-16" v-model="newField.title" @blur="makeKey"></a-input>
                            <a-input v-model="newField.key">
                                <a-icon style="cursor: pointer" @click="handleSave" slot="addonAfter"
                                        type="plus"></a-icon>
                            </a-input>
                        </a-card>
                    </a-col>
                </a-row>
            </div>
            <a-table :columns="columns" :dataSource="data">
                <a slot="operation" slot-scope="text" href="javascript:;">Publish</a>
            </a-table>
        </div>
    </div>
</template>

<script>

    function slugify(text) {
        return text.toString().toLowerCase()
            .replace(/\s+/g, '-')           // Replace spaces with -
            .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
            .replace(/\-\-+/g, '-')         // Replace multiple - with single -
            .replace(/^-+/, '')             // Trim - from start of text
            .replace(/-+$/, '');            // Trim - from end of text
    }

    export default {
        name: "Campaign",
        async asyncData({app, params}) {
            let res = await app.$axios.$get('/campaigns')

            let campaign = null
            if (params.id) {
                let res2 = await app.$axios.$get(`/campaigns/${params.id}`)
                campaign = res2
            }
            return {
                campaigns: res,
                campaign,
            }
        },
        data() {
            return {
                current: ['mail'],
                campaignName: null,
                data: [],
                selectedField: [],
                visible: false,
                loading: false,
                newField: {
                    title: null,
                    key: null
                }
            }
        },
        methods: {
            createCampaign() {
                this.$axios.$post('/campaigns/', {
                    title: this.campaignName
                })
            },
            async handleSave() {
                this.campaign.fields.push(this.newField)
                await this.updateCampaign()
                this.newField = {
                    title: null,
                    key: null
                }
            },
            async updateCampaign() {
                await this.$axios.$put(`/campaigns/${this.campaign._id}/`, {
                    fields: this.campaign.fields
                })
            },
            makeKey(event) {
                if (this.newField.title) {
                    this.newField.key = slugify(this.newField.title)
                }
            }
        },
        computed: {
            columns() {
                if (this.campaign) {
                    return this.campaign.fields.map(x => {
                        x.dataIndex = x.key
                        x.scopedSlots = {customRender: x.key}
                        return x
                    })
                } else {
                    return []
                }
            }
        }
    }
</script>

<style scoped>

</style>
