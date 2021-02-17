<template>
    <div class="ww-popup-airtable-table">
        <label class="airtable-table__label caption-s" for="name-airtable">
            Base
            <div class="airtable-table__label-required">required</div>
        </label>
        <wwEditorSelect
            class="airtable-table__input"
            :options="basesOptions"
            v-model="table.baseId"
            @input="setBase"
            placeholder="Select a base"
            large
        />
        <label class="airtable-table__label caption-s" for="name-airtable">
            Table
            <div class="airtable-table__label-required">required</div>
        </label>
        <wwEditorSelect
            class="airtable-table__input"
            :options="tablesOptions"
            v-model="table.tableId"
            @input="setTable"
            :disabled="!table.baseId"
            placeholder="Select a table"
            large
        />
        <label class="airtable-table__label caption-s" for="table-view">
            View
            <div class="airtable-table__label-required">optional</div>
        </label>
        <wwEditorSelect
            class="airtable-table__input"
            :options="tablesViewsOptions"
            v-model="table.view"
            :disabled="!table.tableId"
            placeholder="Select a view"
            large
        />
        <label class="airtable-table__label caption-s" for="display-by">
            Display by
            <div class="airtable-table__label-required">optional</div>
        </label>
        <wwEditorSelect
            class="airtable-table__input"
            :options="tablesFieldsOptions"
            v-model="table.displayBy"
            :disabled="!table.tableId"
            placeholder="Select a field"
            large
        />
        <label class="airtable-table__label caption-s" for="filter-formula">
            Filter by formula
            <a
                class="airtable-table__link"
                href="//support.airtable.com/hc/en-us/articles/203255215-Formula-field-reference"
                target="_blank"
            >
                Find it here
            </a>
            <div class="airtable-table__label-required">optional</div>
        </label>
        <input
            type="text"
            name="filter-formula"
            class="airtable-table__input caption-m ww-editor-input -large"
            placeholder="{Name} = 'Mr Toucan'"
            v-model="table.filterByFormula"
            :disabled="!table.tableId"
        />
        <div class="airtable-table__row airtable-table__input">
            <label class="airtable-table__label caption-s" for="table-view"> Sort </label>
            <button class="ww-editor-button -primary -small m-auto-left" @click="addSort" :disabled="!table.tableId">
                Add a field to sort by
            </button>
        </div>
        <div
            class="airtable-table__row -space-between airtable-table__input"
            v-for="(sort, index) in table.sort"
            :key="index"
        >
            <div class="caption-s" v-if="!index">Sort by</div>
            <div class="caption-s" v-else>then by</div>
            <wwEditorSelect
                :options="tablesFieldsOptions"
                v-model="sort.field"
                :disabled="!table.tableId"
                placeholder="Select a field"
            />
            <wwEditorSelect
                class="airtable-table__select"
                :options="directionOptions"
                :value="sort.direction"
                @input="updateSort(sort, $event)"
            />
            <div class="airtable-table__button-delete" @click="deleteSort(index)">
                <wwEditorIcon name="delete" small />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'TablePopup',
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
            allBases: [],
            allTables: [],
            directionOptions: [
                { value: 'asc', label: 'Asc', default: true },
                { value: 'desc', label: 'Desc' },
            ],
            table: {
                id: wwLib.wwUtils.getUid(),
                baseId: undefined,
                tableId: undefined,
                view: undefined,
                displayBy: undefined,
                sort: [],
            },
        };
    },
    watch: {
        'table.baseId'() {
            this.getTables();
        },
        'table.tableId'() {
            this.options.setButtonState('SAVE', this.table.tableId ? 'ok' : 'disabled');
        },
    },
    computed: {
        basesOptions() {
            return this.allBases
                .map(base => {
                    return { value: base.id, label: base.name };
                })
                .sort((a, b) => a.label.localeCompare(b.label));
        },
        tablesOptions() {
            return this.allTables
                .map(table => {
                    return { value: table.id, label: table.name };
                })
                .sort((a, b) => a.label.localeCompare(b.label));
        },
        tablesFieldsOptions() {
            const table = this.allTables.find(table => table.id === this.table.tableId);
            if (!table) return [];
            return table.fields
                .map(field => {
                    return { value: field.name, label: field.name };
                })
                .sort((a, b) => a.label.localeCompare(b.label));
        },
        tablesViewsOptions() {
            const table = this.allTables.find(table => table.id === this.table.tableId);
            if (!table) return [];
            return table.views
                .map(view => {
                    return { value: view.name, label: view.name };
                })
                .sort((a, b) => a.label.localeCompare(b.label));
        },
    },
    methods: {
        async getBases() {
            this.options.setLoadingStatus(true);
            this.allBases = await wwLib.wwPlugins.pluginAirtable.getBases();
            this.options.setLoadingStatus(false);
        },
        async getTables() {
            this.options.setLoadingStatus(true);
            this.allTables = await wwLib.wwPlugins.pluginAirtable.getTables(this.table.baseId);
            this.options.setLoadingStatus(false);
        },
        addSort() {
            if (!this.table.sort) this.table.sort = [];
            this.table.sort.push({ field: '', direction: 'asc' });
            this.$forceUpdate();
        },
        updateSort(sort, event) {
            sort.direction = event;
            this.$forceUpdate();
        },
        deleteSort(index) {
            this.table.sort.splice(index, 1);
            this.$forceUpdate();
        },
        setBase() {
            const base = this.allBases.find(base => base.id === this.table.baseId);
            if (base) this.table.baseName = base.name;
            this.table.tableId = undefined;
            this.setTable();
        },
        setTable() {
            const table = this.allTables.find(table => table.id === this.table.tableId);
            if (table) this.table.tableName = table.name;
            this.table.view = undefined;
            this.table.displayBy = undefined;
            this.table.view = undefined;
            this.table.sort = [];
        },
    },
    mounted() {
        this.getBases();
    },
    created() {
        this.table = this.options.data.table || this.table;
        this.options.result.table = this.table;
        this.options.setButtonState('SAVE', this.table.tableId ? 'ok' : 'disabled');
    },
};
</script>

<style scoped lang="scss">
.ww-popup-airtable-table {
    position: relative;
    display: flex;
    flex-direction: column;
    padding: var(--ww-spacing-03) 0;
    .airtable-table {
        &__label {
            display: flex;
            align-items: center;
            font-weight: 500;
            color: var(--ww-color-dark-500);
            margin-bottom: var(--ww-spacing-01);
            &-required {
                margin-left: auto;
                color: var(--ww-color-dark-400);
            }
        }
        &__link {
            color: var(--ww-color-blue-500);
            margin-left: var(--ww-spacing-02);
        }
        &__input {
            margin-bottom: var(--ww-spacing-03);
        }
        &__select {
            min-width: 65px;
            margin-left: var(--ww-spacing-02);
        }
        &__row {
            display: flex;
            align-items: center;
            &.-space-between {
                justify-content: space-between;
                padding: 0 var(--ww-spacing-05);
            }
        }
        &__button-delete {
            margin-right: var(--ww-spacing-03);
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
}
</style>
