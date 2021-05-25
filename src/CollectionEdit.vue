<template>
    <div class="collection-edit">
        <wwEditorFormRow label="Base" required>
            <div class="collection-edit__row">
                <wwEditorSelect
                    class="caption-m collection-edit__input -full"
                    :options="basesOptions"
                    :value="table.baseId"
                    @input="setBase"
                    placeholder="Select a base"
                    large
                />
                <button class="collection-edit__input ww-editor-button -primary -small m-left" @click="getBases(true)">
                    Refresh
                </button>
            </div>
        </wwEditorFormRow>
        <wwEditorFormRow label="Table" required>
            <div class="collection-edit__row">
                <wwEditorSelect
                    class="caption-m collection-edit__input -full"
                    :options="tablesOptions"
                    :value="table.tableId"
                    @input="setTable"
                    :disabled="!table.baseId"
                    placeholder="Select a table"
                    large
                />
                <button
                    class="collection-edit__input ww-editor-button -primary -small m-left"
                    @click="getTables(true)"
                    :disabled="!table.baseId"
                >
                    Refresh
                </button>
            </div>
        </wwEditorFormRow>
        <wwEditorFormRow label="View">
            <wwEditorSelect
                class="caption-m collection-edit__input"
                :options="tablesViewsOptions"
                :value="table.view"
                @input="setProp('view', $event)"
                :disabled="!table.tableId"
                placeholder="Select a view"
                large
            />
        </wwEditorFormRow>
        <wwEditorFormRow label="Filter by formula">
            <template slot="append-label"
                ><a
                    class="collection-edit__link"
                    href="//support.airtable.com/hc/en-us/articles/203255215-Formula-field-reference"
                    target="_blank"
                >
                    Find it here
                </a></template
            >
            <input
                type="text"
                name="filter-formula"
                class="collection-edit__input caption-m ww-editor-input -large"
                placeholder="{Name} = 'Mr Toucan'"
                :value="table.filterByFormula"
                @input="setProp('filterByFormula', $event.target.value)"
                :disabled="!table.tableId"
            />
        </wwEditorFormRow>
        <wwEditorFormRow label="Sort">
            <template slot="append-label">
                <button
                    class="ww-editor-button -primary -small m-auto-left"
                    @click="addSort"
                    :disabled="!table.tableId"
                >
                    Add a field to sort by
                </button>
            </template>
            <div
                class="collection-edit__row -space-between collection-edit__input"
                v-for="(sort, index) in table.sort"
                :key="index"
            >
                <div class="caption-s" v-if="!index">Sort by</div>
                <div class="caption-s" v-else>then by</div>
                <wwEditorSelect
                    class="caption-m"
                    :options="tablesFieldsOptions"
                    :value="sort.field"
                    @input="updateSort(index, 'field', $event)"
                    :disabled="!table.tableId"
                    placeholder="Select a field"
                />
                <wwEditorSelect
                    class="caption-m collection-edit__select"
                    :options="directionOptions"
                    :value="sort.direction"
                    @input="updateSort(index, 'direction', $event)"
                />
                <div class="collection-edit__button-delete" @click="deleteSort(index)">
                    <wwEditorIcon name="delete" small />
                </div>
            </div>
        </wwEditorFormRow>
    </div>
</template>

<script>
export default {
    name: 'TablePopup',
    props: {
        config: { type: Object },
    },
    data() {
        return {
            allBases: [],
            allTables: [],
            directionOptions: [
                { value: 'asc', label: 'Asc', default: true },
                { value: 'desc', label: 'Desc' },
            ],
        };
    },
    watch: {
        'table.baseId'() {
            this.getTables();
        },
        isSetup(value) {
            this.$emit('update-is-valid', value);
        },
    },
    computed: {
        isSetup() {
            return !!this.table.tableId;
        },
        table() {
            return {
                baseId: undefined,
                tableId: undefined,
                view: undefined,
                sort: [],
                ...this.config.table,
            };
        },
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
        async getBases(isNoCache = false) {
            try {
                this.allBases = await wwLib.wwPlugins['plugin-airtable'].getBases(isNoCache);
            } catch (err) {
                wwLib.wwNotification.open({
                    text: 'Unable to pull your bases, please make sure you entered the correct API key.',
                    color: 'red',
                });
            }
        },
        async getTables(isNoCache = false) {
            try {
                this.allTables = await wwLib.wwPlugins['plugin-airtable'].getTables(this.table.baseId, isNoCache);
            } catch (err) {
                wwLib.wwNotification.open({
                    text: 'Unable to pull your tables, please make sure you entered the correct API key.',
                    color: 'red',
                });
            }
        },
        addSort() {
            const sort = this.table.sort || [];
            sort.push({ field: '', direction: 'asc' });
            this.$emit('update-config', { table: { ...this.table, sort } });
        },
        updateSort(index, key, value) {
            if (this.table.sort[index][key] === value) return;
            const sort = [...(this.table.sort || [])];
            sort[index][key] = value;
            this.$emit('update-config', { table: { ...this.table, sort } });
        },
        deleteSort(index) {
            const sort = [...this.table.sort];
            sort.splice(index, 1);
            this.$emit('update-config', { table: { ...this.table, sort } });
        },
        setBase(baseId) {
            if (baseId === this.table.baseId) return;
            const base = this.allBases.find(base => base.id === baseId);
            const newTable = {};
            if (base) newTable.baseName = base.name;
            newTable.tableId = undefined;
            newTable.baseId = baseId;
            const newConfig = { table: { ...this.table, ...newTable, ...this.getTable(undefined) } };
            this.$emit('update-config', newConfig);
        },
        getTable(tableId) {
            const table = this.allTables.find(table => table.id === tableId);
            const result = {};
            if (table) {
                result.tableName = table.name;
                result.view = table.views[0] && table.views[0].name;
                if (table.fields.find(field => field.name === 'Name')) result.displayBy = 'Name';
            } else {
                result.view = undefined;
                result.displayBy = undefined;
            }
            result.sort = [];
            result.tableId = tableId;

            return result;
        },
        setTable(tableId) {
            if (this.table.id === tableId) return;
            this.$emit('update-config', { table: { ...this.table, ...this.getTable(tableId) } });
        },
        setProp(key, value) {
            if (this.table[key] === value) return;
            this.$emit('update-config', { table: { ...this.table, [key]: value } });
        },
    },
    mounted() {
        this.getBases();
    },
};
</script>

<style scoped lang="scss">
.collection-edit {
    display: flex;
    flex-direction: column;
    &__link {
        color: var(--ww-color-blue-500);
        margin-left: var(--ww-spacing-02);
    }
    &__row {
        display: flex;
        align-items: center;
        *:first-child {
            flex: 1;
        }
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
.m-left {
    margin-left: var(--ww-spacing-02);
}
</style>
