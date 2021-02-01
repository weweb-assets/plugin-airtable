<template>
    <div class="ww-popup-airtable-bases">
        <button class="airtable-bases__all ww-editor-button -primary" @click="addBase">Add base</button>
        <div class="airtable-bases__container" v-for="(base, index) in settings.privateData.bases" :key="index">
            <div class="airtable-bases__row -base">
                <div class="paragraph-m">{{ base.displayName || base.name }}</div>
                <button class="ww-editor-button -primary -small m-auto-left" @click="addTable(base)">Add table</button>
                <button class="ww-editor-button -secondary -small m-left" @click="editBase(base, index)">Edit</button>
                <div class="airtable-bases__button-delete m-left" @click="deleteBase(index)">
                    <wwEditorIcon name="delete" small />
                </div>
            </div>
            <div class="airtable-bases__row -table" v-for="(table, index) in base.tables" :key="index">
                <div class="caption-m">{{ table.displayName || table.name }}</div>
                <button class="ww-editor-button -secondary -small m-auto-left" @click="editTable(base, index, table)">
                    Edit
                </button>
                <div class="airtable-bases__button-delete m-left" @click="deleteTable(base, index)">
                    <wwEditorIcon name="delete" small />
                </div>
            </div>
            <div class="airtable-bases__separator"></div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'BasesPopup',
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
        async addBase() {
            try {
                const result = await wwLib.wwPopups.open({
                    firstPage: 'AIRTABLE_ADD_BASE_POPUP',
                });
                this.settings.privateData.bases.push(result.base);
            } catch (err) {
                wwLib.wwLog.error(err);
            }
        },
        async editBase(base, index) {
            try {
                const result = await wwLib.wwPopups.open({
                    firstPage: 'AIRTABLE_EDIT_BASE_POPUP',
                    data: { base },
                });
                this.settings.privateData.bases.splice(index, 1, result.base);
            } catch (err) {
                wwLib.wwLog.error(err);
            }
        },
        deleteBase(index) {
            this.settings.privateData.bases.splice(index, 1);
        },
        async addTable(base) {
            try {
                const result = await wwLib.wwPopups.open({
                    firstPage: 'AIRTABLE_ADD_TABLE_POPUP',
                });
                base.tables.push(result.table);
            } catch (err) {
                wwLib.wwLog.error(err);
            }
        },
        async editTable(base, index, table) {
            try {
                const result = await wwLib.wwPopups.open({
                    firstPage: 'AIRTABLE_EDIT_TABLE_POPUP',
                    data: { table },
                });
                base.tables.splice(index, 1, result.table);
            } catch (err) {
                wwLib.wwLog.error(err);
            }
        },
        deleteTable(base, index) {
            base.tables.splice(index, 1);
        },
        async beforeNext() {
            this.options.setLoadingStatus(true);
            try {
                const plugin = wwLib.wwPlugins.pluginAirtable;
                plugin.settings = await wwLib.wwPlugin.saveSettings(
                    plugin.id,
                    plugin.settings.id,
                    this.settings.data,
                    this.settings.privateData
                );

                const oldTables = this.options.data.settings.privateData.bases.map(base => base.tables).flat(1);
                const newTables = this.options.result.settings.privateData.bases.map(base => base.tables).flat(1);
                const deletedTables = oldTables.filter(table => !newTables.find(elem => elem.id === table.id));
                deletedTables.forEach(table => wwLib.wwPlugin.deleteCmsDataSet(table.id));

                wwLib.wwPlugins.pluginAirtable.settings = plugin.settings;
                this.options.data.settings = plugin.settings;
            } catch (err) {
                wwLib.wwLog.error(err);
            }
            this.options.setLoadingStatus(false);
        },
    },
    created() {
        this.settings = _.cloneDeep(this.options.data.settings || this.settings);
        this.options.result.settings = this.settings;
    },
};
</script>

<style scoped lang="scss">
.ww-popup-airtable-bases {
    position: relative;
    display: flex;
    flex-direction: column;
    padding: var(--ww-spacing-03) 0;
    .airtable-bases {
        &__container {
            &:not(:last-child) {
                .airtable-bases__separator {
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
            justify-content: space-between;
            &.-base {
                margin-bottom: var(--ww-spacing-03);
            }
            &.-table {
                margin: 0 var(--ww-spacing-02);
                margin-bottom: var(--ww-spacing-03);
            }
        }
        &__button-delete {
            margin: 0 var(--ww-spacing-03);
            cursor: pointer;
            transition: color 0.3s ease;
            &:hover {
                color: var(--ww-color-red-500);
            }
        }
    }
    .m-auto-left {
        margin-left: auto;
    }
    .m-left {
        margin-left: var(--ww-spacing-03);
    }
}
</style>
