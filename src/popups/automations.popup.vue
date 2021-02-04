<template>
    <div class="ww-popup-airtable-automations">
        <div class="airtable-automations__container" v-for="(base, index) in settings.privateData.bases" :key="index">
            <div class="airtable-automations__row -base">
                <div class="paragraph-m">{{ base.displayName || base.name }}</div>
            </div>
            <div class="airtable-automations__row -table" v-for="(table, index) in base.tables" :key="index">
                <div class="caption-m">{{ table.name }}</div>
                <button class="ww-editor-button -primary -green -small m-auto-left" @click="copyCode(base, table)">
                    <wwEditorIcon class="ww-editor-button-icon -left" name="copy-paste" small />
                    Copy code
                </button>
                <a
                    class="ww-editor-button -secondary -small m-left"
                    :href="`//airtable.com/${base.name}`"
                    target="_blank"
                >
                    <wwEditorIcon class="ww-editor-button-icon -left" name="open-out" small />
                    Setup automation
                </a>
            </div>
            <div class="airtable-automations__separator"></div>
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
                    bases: [],
                },
            },
        };
    },
    methods: {
        async copyCode(base, table) {
            const designId = wwLib.wwWebsiteData.getInfo().id;
            await navigator.clipboard.writeText(
                `fetch('https://data.weweb.io/callback/designs/${designId}/cms_data_set/${table.id}?base=${base.name}&table=${table.name}')`
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
        &__container {
            &:not(:last-child) {
                .airtable-automations__separator {
                    margin: var(--ww-spacing-04);
                    border-bottom: 2px solid var(--ww-color-dark-300);
                }
            }
        }
        &__all {
            margin: var(--ww-spacing-02) auto;
        }
        &__row {
            display: flex;
            align-items: center;
            &.-base {
                margin-bottom: var(--ww-spacing-03);
            }
            &.-table {
                margin: 0 var(--ww-spacing-02);
                margin-bottom: var(--ww-spacing-03);
            }
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
