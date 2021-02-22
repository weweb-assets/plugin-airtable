<template>
    <div class="ww-popup-airtable-sync">
        <button class="airtable-sync__all ww-editor-button -primary -green" @click="syncAll" :disabled="isFetching">
            <div v-if="!isFetching">Synchronize all</div>
            <div v-else>Fetching...</div>
        </button>
        <div class="airtable-sync__row" v-for="(table, index) in settings.privateData.tables" :key="index">
            <div class="paragraph-m">{{ table.tableName }}</div>
            <div class="caption-m m-auto-left">
                <template v-if="!isTableFetching(table)">
                    <template v-if="getSource(table).lastSyncDate">
                        {{ getSource(table).lastSyncDate | dateFromNow }}
                    </template>
                    <template v-else>never synchronized</template>
                </template>
            </div>
            <button
                :disabled="isTableFetching(table)"
                class="ww-editor-button -primary -green -small m-left"
                @click="sync(table)"
            >
                <div v-if="!isTableFetching(table)">Synchronize table</div>
                <div v-else>Fetching...</div>
            </button>
        </div>
        <div class="airtable-sync__separator"></div>
    </div>
</template>

<script>
import moment from 'moment';

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
    filters: {
        dateFromNow(date) {
            return moment(date).fromNow();
        },
    },
    data() {
        return {
            isFetching: false,
            tablesFetching: [],
            settings: {
                privateData: {},
            },
        };
    },
    methods: {
        getSource(table) {
            return wwLib.$store.getters['cms/getData'][table.id] || {};
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
        async sync(table) {
            this.tableFetching(table, true);
            try {
                await wwLib.wwPlugin.saveCmsDataSet(
                    this.settings.id,
                    table.id,
                    table.tableName,
                    table.displayBy,
                    'Airtable'
                );

                wwLib.wwNotification.open({
                    text: {
                        en: `Table "${table.tableName}" succesfully fetched`,
                    },
                    color: 'green',
                });
            } catch (err) {
                wwLib.wwNotification.open({
                    text: {
                        en: 'An error occured, please try again later.',
                        fr: 'Une erreur est survenue. Veuillez réessayer plus tard.',
                    },
                    color: 'red',
                });
                wwLib.wwLog.error(err);
            }
            this.tableFetching(table, false);
        },
        async syncAll() {
            this.isFetching = true;
            for (const table of this.settings.privateData.tables) await this.sync(table);
            this.isFetching = false;
        },
    },
    created() {
        this.settings = this.options.data.settings;
    },
    mounted() {
        if (this.options.data.isFirstTime) this.syncAll();
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
        &__all {
            margin: 0 auto var(--ww-spacing-02) auto;
        }
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
