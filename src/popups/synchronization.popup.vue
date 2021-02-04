<template>
    <div class="ww-popup-airtable-sync">
        <button class="airtable-sync__all ww-editor-button -primary -green" @click="syncAll" :disabled="isFetching">
            <div v-if="!isFetching">Synchronize all</div>
            <div v-else>Fetching...</div>
        </button>
        <div class="airtable-sync__container" v-for="(base, index) in settings.privateData.bases" :key="index">
            <div class="airtable-sync__row -base">
                <div class="paragraph-m">{{ base.displayName || base.name }}</div>
                <button
                    :disabled="isBaseFetching(base)"
                    class="ww-editor-button -primary -green -small"
                    @click="syncBase(base, table)"
                    v-if="base.tables.length"
                >
                    <div v-if="!isBaseFetching(base)">Synchronize base</div>
                    <div v-else>Fetching...</div>
                </button>
            </div>
            <div class="airtable-sync__row -table" v-for="(table, index) in base.tables" :key="index">
                <div class="caption-m">{{ table.name }}</div>
                <button
                    :disabled="isBaseFetching(base) || isTableFetching(table)"
                    class="ww-editor-button -primary -green -small"
                    @click="sync(base, table)"
                >
                    <div v-if="!isTableFetching(table)">Synchronize table</div>
                    <div v-else>Fetching...</div>
                </button>
            </div>
            <div class="airtable-sync__separator"></div>
        </div>
    </div>
</template>

<script>
import api from '../api';

export default {
    name: 'SynchronizationPopup',
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
            isFetching: false,
            basesFetching: [],
            tablesFetching: [],
            settings: {
                privateData: {
                    apiKey: '',
                    bases: [],
                },
            },
        };
    },
    methods: {
        isBaseFetching(base) {
            return this.basesFetching.indexOf(base.name) !== -1;
        },
        baseFetching(base, value) {
            if (value) {
                this.basesFetching.push(base.name);
            } else {
                const index = this.basesFetching.indexOf(base.name);
                if (index !== -1) this.basesFetching.splice(index, 1);
            }
        },
        isTableFetching(table) {
            return this.tablesFetching.indexOf(table.id) !== -1;
        },
        tableFetching(table, value) {
            if (value) {
                this.tablesFetching.push(table.id);
            } else {
                const index = this.tablesFetching.indexOf(table.id);
                if (index !== -1) this.tablesFetching.splice(index, 1);
            }
        },
        async sync(base, table) {
            this.tableFetching(table, true);
            try {
                const airtableBase = api.getBase(base.name);
                const values = await api.getTable(airtableBase, table.name, {
                    filterByFormula: table.filterByFormula || '',
                    sort: table.sort || [],
                    view: table.view || '',
                });
                wwLib.wwPlugin.saveCmsDataSet(
                    this.settings.id,
                    table.id,
                    table.name,
                    table.displayBy,
                    'Airtable',
                    values
                );
                wwLib.wwNotification.open({
                    text: {
                        en: `Table "${table.name}" succesfully fetched`,
                    },
                    color: 'green',
                });
            } catch (err) {
                wwLib.wwNotification.open({
                    text: {
                        en: err.message || 'An error occured, please try again later.',
                        fr: err.message || 'Une erreur est survenue. Veuillez réessayer plus tard.',
                    },
                    color: 'red',
                });
                wwLib.wwLog.error(err);
            }
            this.tableFetching(table, false);
        },
        async syncBase(base) {
            this.baseFetching(base, true);
            for (const table of base.tables) await this.sync(base, table);
            this.baseFetching(base, false);
        },
        async syncAll() {
            this.isFetching = true;
            for (const base of this.settings.privateData.bases) await this.syncBase(base);
            this.isFetching = false;
        },
    },
    created() {
        this.settings = _.cloneDeep(this.options.data.settings || this.settings);
        api.configure(this.settings.privateData.apiKey);
    },
};
</script>

<style scoped lang="scss">
.ww-popup-airtable-sync {
    position: relative;
    display: flex;
    flex-direction: column;
    padding: var(--ww-spacing-03) 0;
    .airtable-sync {
        &__container {
            &:not(:last-child) {
                .airtable-sync__separator {
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
    }
    .m-auto-left {
        margin-left: auto;
    }
}
</style>
