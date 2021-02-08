<template>
    <div class="ww-popup-airtable-automations">
        <div class="airtable-automations__row" v-for="(table, index) in settings.privateData.tables" :key="index">
            <div class="paragraph-m">{{ table.tableName }}</div>
            <button class="ww-editor-button -primary -green -small m-auto-left" @click="copyCode(table)">
                <wwEditorIcon class="ww-editor-button-icon -left" name="copy-paste" small />
                Copy code
            </button>
            <a
                class="ww-editor-button -secondary -small m-left"
                :href="`//airtable.com/${table.baseId}`"
                target="_blank"
            >
                <wwEditorIcon class="ww-editor-button-icon -left" name="open-out" small />
                Setup automation
            </a>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AutomationsPopup',
    props: {
        options: {
            type: Object,
            default() {
                return {};
            },
        },
    },
    data() {
        return {
            settings: {
                privateData: {
                    apiKey: '',
                    tables: [],
                },
            },
        };
    },
    methods: {
        async copyCode(table) {
            const designId = wwLib.wwWebsiteData.getInfo().id;
            await wwLib
                .getManagerWindow()
                .navigator.clipboard.writeText(
                    `fetch('https://data.weweb.io/designs/${designId}/cms_data_set/${table.id}/callback')`
                );
            wwLib.wwNotification.open({
                text: {
                    en: 'Code copied to clipboard',
                },
                color: 'green',
            });
        },
    },
    created() {
        this.settings = _.cloneDeep(this.options.data.settings || this.settings);
    },
};
</script>

<style scoped lang="scss">
.ww-popup-airtable-automations {
    position: relative;
    display: flex;
    flex-direction: column;
    padding: var(--ww-spacing-03) 0;
    .airtable-automations {
        &__row {
            display: flex;
            align-items: center;
            margin-bottom: var(--ww-spacing-04);
        }
    }
    .m-auto-left {
        margin-left: auto;
    }
    .m-left {
        margin-left: var(--ww-spacing-02);
    }
}
</style>
