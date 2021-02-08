<template>
    <div class="ww-popup-airtable-tables">
        <button class="airtable-tables__all ww-editor-button -primary" @click="addTable">Add table</button>
        <div class="airtable-tables__row" v-for="(table, index) in settings.privateData.tables" :key="index">
            <div class="paragraph-m">{{ table.tableName }}</div>
            <button class="ww-editor-button -secondary -small m-auto-left" @click="editTable(index, table)">
                Edit
            </button>
            <div class="airtable-tables__button-delete m-left" @click="deleteTable(index)">
                <wwEditorIcon name="delete" small />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'TablesPopup',
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
        async addTable() {
            try {
                const result = await wwLib.wwPopups.open({
                    firstPage: 'AIRTABLE_ADD_TABLE_POPUP',
                    data: { apiKey: this.settings.privateData.apiKey },
                });
                this.settings.privateData.tables.push(result.table);
            } catch (err) {
                wwLib.wwLog.error(err);
            }
        },
        async editTable(index, table) {
            try {
                const result = await wwLib.wwPopups.open({
                    firstPage: 'AIRTABLE_EDIT_TABLE_POPUP',
                    data: { apiKey: this.settings.privateData.apiKey, table },
                });
                this.settings.privateData.tables.splice(index, 1, result.table);
            } catch (err) {
                wwLib.wwLog.error(err);
            }
        },
        deleteTable(index) {
            this.settings.privateData.tables.splice(index, 1);
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

                const oldTables = this.options.data.settings.privateData.tables;
                const newTables = this.options.result.settings.privateData.tables;
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
.ww-popup-airtable-tables {
    position: relative;
    display: flex;
    flex-direction: column;
    padding: var(--ww-spacing-03) 0;
    .airtable-tables {
        &__all {
            margin: 0 auto var(--ww-spacing-02) auto;
        }
        &__row {
            display: flex;
            align-items: center;
            margin-bottom: var(--ww-spacing-04);
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
