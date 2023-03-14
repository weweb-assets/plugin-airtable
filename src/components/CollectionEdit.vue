<template>
    <div class="airtable-collection-edit">
        <div class="airtable-collection-edit__row">
            <wwEditorFormRow label="Base" required class="-full">
                <wwEditorInputTextSelect
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
                <wwEditorInputTextSelect
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
        <wwEditorFormRow label="View" required>
            <wwEditorInputTextSelect
                :options="tablesViewsOptions"
                :model-value="table.view"
                :disabled="!table.tableId"
                placeholder="Select a view"
                large
                @update:modelValue="setProp('view', $event)"
            />
        </wwEditorFormRow>
        <wwEditorFormRow v-if="config.depth && config.depth != '0'" label="Lookup depth">
            <wwEditorInputText
                type="number"
                name="depth"
                placeholder="Default: 0"
                :model-value="table.depth"
                large
                @update:modelValue="setProp('depth', $event)"
            />
        </wwEditorFormRow>
        <wwEditorInputRow
            label="Filter fields to fetch"
            required
            type="select"
            multiple
            :options="tablesFieldsOptions"
            :model-value="table.fields"
            placeholder="All fields"
            @update:modelValue="setProp('fields', $event)"
        />
        <wwEditorFormRow label="Filter by formula">
            <template #append-label>
                <a class="airtable-settings-edit__link" href="https://airtable.com/filter" target="_blank">
                    Find it here
                </a>
            </template>
            <wwEditorInputText
                type="text"
                placeholder="Airtable formula"
                :model-value="table.filterByFormula"
                :bindable="collection.mode === 'dynamic'"
                @update:modelValue="setProp('filterByFormula', $event)"
            />
        </wwEditorFormRow>
        <wwLoader :loading="isBasesLoading || isTablesLoading" />
    </div>
</template>

<script>
export default {
    props: {
        collection: { type: Object, required: true },
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
            filterFieldsActions: [{ icon: 'delete', label: 'Remove field', onAction: this.deleteField }],
        };
    },
    computed: {
        table() {
            return {
                baseId: undefined,
                tableId: undefined,
                view: undefined,
                depth: 0,
                fields: null,
                ...this.config,
            };
        },
        basesOptions() {
            return this.allBases
                .map(base => ({ value: base.id, label: base.name }))
                .sort((a, b) => a.label.localeCompare(b.label));
        },
        tablesOptions() {
            return this.allTables
                .map(table => ({ value: table.id, label: table.name }))
                .sort((a, b) => a.label.localeCompare(b.label));
        },
        tablesViewsOptions() {
            const table = this.allTables.find(table => table.id === this.table.tableId);
            if (!table) return [];
            return table.views
                .map(view => ({ value: view.name, label: view.name }))
                .sort((a, b) => a.label.localeCompare(b.label));
        },
        tablesFieldsOptions() {
            const table = this.allTables.find(table => table.id === this.table.tableId);
            if (!table) return [];
            return table.fields
                .map(field => ({ value: field.name, label: field.name }))
                .sort((a, b) => a.label.localeCompare(b.label));
        },
        isFilterFields() {
            return this.table.fields !== null;
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
        filterFields() {
            this.setProp('fields', !this.isFilterFields ? [] : null);
        },
        setFieldsProp(index, field) {
            if (!field) return;
            const fields = _.cloneDeep(this.table.fields);
            if (index === null || index > fields.length) fields.push(field);
            else fields[index] = field;
            this.setProp('fields', fields);
        },
        deleteField(index) {
            const fields = _.cloneDeep(this.table.fields);
            fields.splice(index, 1);
            this.setProp('fields', fields);
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
        &.-wrap {
            flex-wrap: wrap;
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
    .m-right {
        margin-right: var(--ww-spacing-02);
    }
    .m-bottom {
        margin-bottom: var(--ww-spacing-02);
    }
    .w-50 {
        width: 50%;
    }
}
</style>
