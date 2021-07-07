<template>
    <div class="airtable-collection-edit">
        <div class="airtable-collection-edit__row">
            <wwEditorFormRow label="Base" required class="-full">
                <wwEditorSelect
                    :options="basesOptions"
                    :model-value="table.baseId"
                    placeholder="Select a base"
                    large
                    @update:modelValue="setBase"
                />
            </wwEditorFormRow>
            <button type="button" class="ww-editor-button -primary -small m-left" @click="getBases(true)">
                Refresh
            </button>
        </div>
        <div class="airtable-collection-edit__row">
            <wwEditorFormRow label="Table" required class="-full">
                <wwEditorSelect
                    :options="tablesOptions"
                    :model-value="table.tableId"
                    :disabled="!table.baseId"
                    placeholder="Select a table"
                    large
                    @update:modelValue="setTable"
                />
            </wwEditorFormRow>
            <button
                type="button"
                class="ww-editor-button -primary -small m-left"
                :disabled="!table.baseId"
                @click="getTables(true)"
            >
                Refresh
            </button>
        </div>
        <div class="airtable-collection-edit__row">
            <wwEditorFormRow label="View" class="-full" required>
                <wwEditorSelect
                    :options="tablesViewsOptions"
                    :model-value="table.view"
                    :disabled="!table.tableId"
                    placeholder="Select a view"
                    large
                    @update:modelValue="setProp('view', $event)"
                />
            </wwEditorFormRow>
            <wwEditorFormRow label="Lookup depth" class="m-left">
                <wwEditorFormInput
                    type="number"
                    name="depth"
                    placeholder="Default: 1"
                    :model-value="table.depth"
                    large
                    @update:modelValue="setProp('depth', $event)"
                />
            </wwEditorFormRow>
        </div>
        <wwEditorFormRow label="Filter by formula">
            <template #append-label>
                <a
                    class="airtable-collection-edit__link"
                    href="//support.airtable.com/hc/en-us/articles/203255215-Formula-field-reference"
                    target="_blank"
                >
                    Find it here
                </a>
            </template>
            <wwEditorFormInput
                type="text"
                name="filter-formula"
                placeholder="{Name} = 'Mr Toucan'"
                :model-value="table.filterByFormula"
                large
                @update:modelValue="setProp('filterByFormula', $event)"
            />
        </wwEditorFormRow>
        <wwEditorFormRow label="Sort">
            <template #append-label>
                <button
                    type="button"
                    class="ww-editor-button -primary -small m-auto-left m-bottom"
                    :disabled="!table.tableId"
                    @click="addSort"
                >
                    Add a field to sort by
                </button>
            </template>
            <div
                v-for="(sort, index) in table.sort"
                :key="index"
                class="airtable-collection-edit__row -space-between m-bottom"
            >
                <div v-if="!index" class="label-xs">Sort by</div>
                <div v-else class="label-xs">then by</div>
                <wwEditorSelect
                    :options="tablesFieldsOptions"
                    :model-value="sort.field"
                    :disabled="!table.tableId"
                    placeholder="Select a field"
                    @update:modelValue="setSortProp(index, { field: $event })"
                />
                <wwEditorSelect
                    :options="directionOptions"
                    :model-value="sort.direction"
                    @update:modelValue="setSortProp(index, { direction: $event })"
                />
                <button type="button" class="ww-editor-button -tertiary -small -red -icon" @click="deleteSort(index)">
                    <wwEditorIcon class="ww-editor-button-icon" name="delete" small />
                </button>
            </div>
        </wwEditorFormRow>
        <wwLoader :loading="isBasesLoading || isTablesLoading" />
    </div>
</template>

<script>
export default {
    props: {
        plugin: { type: Object, required: true },
        config: { type: Object, required: true },
    },
    emits: ['update:config'],
    data() {
        return {
            isBasesLoading: false,
            isTablesLoading: false,
            allBases: [],
            allTables: [],
            directionOptions: [
                { value: 'asc', label: 'Asc', default: true },
                { value: 'desc', label: 'Desc' },
            ],
        };
    },
    computed: {
        table() {
            return {
                baseId: undefined,
                tableId: undefined,
                view: undefined,
                depth: 1,
                sort: [],
                ...this.config,
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
    watch: {
        'table.baseId': {
            immediate: true,
            handler() {
                this.getTables();
            },
        },
    },
    mounted() {
        this.getBases();
    },
    methods: {
        async getBases(isNoCache = false) {
            this.isBasesLoading = true;
            try {
                this.allBases = await this.plugin.getBases(isNoCache);
            } catch (err) {
                wwLib.wwNotification.open({
                    text: 'Unable to pull your bases, please make sure you entered the correct API key.',
                    color: 'red',
                });
            }
            this.isBasesLoading = false;
        },
        async getTables(isNoCache = false) {
            if (!this.table.baseId) return;
            this.isTablesLoading = true;
            try {
                this.allTables = await this.plugin.getTables(this.table.baseId, isNoCache);
            } catch (err) {
                wwLib.wwNotification.open({
                    text: 'Unable to pull your tables, please make sure you entered the correct API key.',
                    color: 'red',
                });
            }
            this.isTablesLoading = false;
        },
        addSort() {
            const sorts = _.cloneDeep(this.table.sort || []);
            sorts.push({ field: this.tablesFieldsOptions[0].value, direction: 'asc' });
            this.setProp('sort', sorts);
        },
        setSortProp(index, value) {
            const sorts = _.cloneDeep(this.table.sort);
            sorts.splice(index, 1, { ...sorts[index], ...value });
            this.setProp('sort', sorts);
        },
        deleteSort(index) {
            const sorts = _.cloneDeep(this.table.sort);
            sorts.splice(index, 1);
            this.setProp('sort', sorts);
        },
        setBase(baseId) {
            if (baseId === this.table.baseId) return;
            const base = this.allBases.find(base => base.id === baseId);
            const newTable = {};
            if (base) newTable.baseName = base.name;
            newTable.tableId = undefined;
            newTable.baseId = baseId;
            const newConfig = { ...this.table, ...newTable, ...this.getTable(undefined) };
            this.$emit('update:config', newConfig);
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
            this.$emit('update:config', { ...this.table, ...this.getTable(tableId) });
        },
        setProp(key, value) {
            if (this.table[key] === value) return;
            this.$emit('update:config', { ...this.table, [key]: value });
        },
    },
};
</script>

<style scoped lang="scss">
.airtable-collection-edit {
    display: flex;
    flex-direction: column;
    &__link {
        color: var(--ww-color-blue-500);
        margin-left: var(--ww-spacing-02);
    }
    &__row {
        display: flex;
        align-items: center;
        &.-space-between {
            justify-content: space-between;
        }
        .-full {
            width: 100%;
        }
    }
    .m-auto-left {
        margin-left: auto;
    }
    .m-left {
        margin-left: var(--ww-spacing-02);
    }
    .m-bottom {
        margin-bottom: var(--ww-spacing-02);
    }
}
</style>
