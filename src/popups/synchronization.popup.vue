<template>
    <div class="ww-popup-settings">
        <button class="settings__all ww-editor-button -primary -green" @click="syncAll" :disabled="isFetching">
            <div v-if="!isFetching">Synchronize all</div>
            <div v-else>Fetching...</div>
        </button>
        <div v-for="(base, index) in settings.privateData.bases" :key="index">
            <div class="settings__row settings__input">
                <div class="paragraph-m">{{ base.displayName || base.name }}</div>
                <button
                    :disabled="isBaseFetching(base)"
                    class="ww-editor-button -primary -green -small"
                    @click="syncBase(base, table)"
                >
                    <div v-if="!isBaseFetching(base)">Synchronize base</div>
                    <div v-else>Fetching...</div>
                </button>
            </div>
            <div class="settings__row -tables settings__input" v-for="(table, index) in base.tables" :key="index">
                <div class="caption-m">{{ table.displayName || table.name }}</div>
                <button
                    :disabled="isBaseFetching(base) || isTableFetching(table)"
                    class="ww-editor-button -primary -green -small"
                    @click="sync(base, table)"
                >
                    <div v-if="!isTableFetching(table)">Synchronize table</div>
                    <div v-else>Fetching...</div>
                </button>
            </div>
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
                const values = await api.getTable(airtableBase, table.name);
                wwLib.wwPlugin.saveCmsDataSet(this.settings.id, table.id, table.displayName, 'Airtable', values);
            } catch (err) {
                wwLib.wwLog.error(JSON.stringify(err));
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
.ww-popup-settings {
    position: relative;
    display: flex;
    flex-direction: column;
    padding: var(--ww-spacing-03) 0;
    .settings {
        &__all {
            margin: var(--ww-spacing-02) auto;
        }
        &__input {
            margin-bottom: var(--ww-spacing-03);
        }
        &__row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            &.-tables {
                margin-left: var(--ww-spacing-02);
                margin-right: var(--ww-spacing-02);
            }
        }
    }
}
</style>
