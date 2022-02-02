<template>
    <wwEditorFormRow label="Collection" required>
        <wwEditorInputTextSelect
            :options="collectionOptions"
            :model-value="collectionId"
            placeholder="Select a collection"
            @update:modelValue="setCollectionId"
        />
    </wwEditorFormRow>
    <wwEditorFormRow label="Record ID" required>
        <wwEditorInput
            type="query"
            :model-value="recordId"
            placeholder="Enter a record ID"
            label="Record ID"
            bindable
            @update:modelValue="setRecordId"
        />
    </wwEditorFormRow>
    <div v-if="collection" class="relative">
        <div v-for="field of tableFields" :key="field.label">
            <wwEditorInputRow
                v-if="typesConvertion[field.type]"
                :placeholder="field.options ? 'Select a value' : 'Enter a value'"
                :type="typesConvertion[field.type]"
                :model-value="data[field.label]"
                :options="field.options"
                :label="field.label"
                step="0.1"
                bindable
                @update:modelValue="setRecordData(field.label, $event)"
                @add-item="addItem(field)"
            >
                <template v-if="typesConvertion[field.type] === 'array'" #default="{ item, setItem }">
                    <wwEditorFormRow v-if="field.type === 'multipleRecordLinks'">
                        <wwEditorInput
                            type="query"
                            :model-value="item"
                            :label="field.label"
                            placeholder="Enter a record ID"
                            bindable
                            small
                            @update:modelValue="setItem($event)"
                        />
                    </wwEditorFormRow>
                    <wwEditorFormRow v-else-if="field.type === 'multipleSelects'">
                        <wwEditorInput
                            type="select"
                            :model-value="item"
                            :label="field.label"
                            placeholder="Select a value"
                            :options="field.options"
                            bindable
                            small
                            @update:modelValue="setItem($event)"
                        />
                    </wwEditorFormRow>
                    <wwEditorFormRow v-else-if="field.type === 'multipleAttachments'">
                        <wwEditorInput
                            type="query"
                            :model-value="item.url"
                            :label="field.label"
                            placeholder="Enter an URL"
                            bindable
                            small
                            @update:modelValue="setItem({ url: $event })"
                        />
                    </wwEditorFormRow>
                </template>
            </wwEditorInputRow>
        </div>
        <wwLoader v-if="isTablesLoading" :loading="true" />
    </div>
</template>

<script>
export default {
    props: {
        plugin: { type: Object, required: true },
        args: { type: Array, default: () => [null, null, {}] },
    },
    emits: ['update:args'],
    data() {
        return {
            isTablesLoading: false,
            allTables: [],
            typesConvertion: {
                singleLineText: 'query',
                multilineText: 'string',
                checkbox: 'boolean',
                richText: 'query',
                multipleSelects: 'array',
                singleSelect: 'select',
                singleCollaborator: 'query',
                date: 'query',
                phoneNumber: 'query',
                email: 'query',
                url: 'query',
                number: 'number',
                currency: 'number',
                percent: 'number',
                duration: 'number',
                rating: 'number',
                barcode: 'query',
                multipleRecordLinks: 'array',
                multipleAttachments: 'array',
            },
        };
    },
    computed: {
        collectionOptions() {
            const collections = wwLib.$store.getters['data/getCollections'];
            const plugins = wwLib.$store.getters['websiteData/getPluginById'];
            return Object.values(collections)
                .filter(collection => plugins(collection.pluginId).name === 'airtable')
                .map(collection => ({
                    label: collection.name,
                    value: collection.id,
                    icon: plugins(collection.pluginId).name,
                }));
        },
        collectionId() {
            return this.args[0];
        },
        collection() {
            return wwLib.$store.getters['data/getCollections'][this.collectionId];
        },
        recordId() {
            return this.args[1];
        },
        data() {
            return this.args[2];
        },
        tableFields() {
            if (!this.collection) return [];
            const table = this.allTables.find(table => table.id === this.collection.config.tableId);
            return (
                table &&
                table.fields.map(field => ({
                    label: field.name,
                    type: field.type,
                    options: ((field.options && field.options.choices) || []).map(choice => ({
                        value: choice.name,
                        label: choice.name,
                    })),
                }))
            );
        },
    },
    watch: {
        'collection.id'() {
            this.getTables(true);
        },
    },
    mounted() {
        this.getTables(true);
    },
    methods: {
        addItem(field) {
            if (field.type === 'multipleAttachments')
                this.setRecordData(field.label, [...(this.data[field.label] || []), { url: '' }]);
            else this.setRecordData(field.label, [...(this.data[field.label] || []), '']);
        },
        setCollectionId(collectionId) {
            this.$emit('update:args', [collectionId, this.recordId, this.data]);
        },
        setRecordId(recordId) {
            this.$emit('update:args', [this.collectionId, recordId, this.data]);
        },
        setRecordData(key, value) {
            const data = { ...this.data, [key]: value };
            for (const dataKey in data) {
                if (!this.tableFields.find(field => field.label === dataKey)) {
                    delete data[dataKey];
                }
            }
            this.$emit('update:args', [this.collectionId, this.recordId, data]);
        },
        async getTables(isNoCache = false) {
            if (!this.collection || !this.collection.config.baseId) return;
            this.isTablesLoading = true;
            try {
                this.allTables = await this.plugin.getTables(this.collection.config.baseId, isNoCache);
            } catch (err) {
                wwLib.wwNotification.open({
                    text: 'Unable to pull your tables, please make sure you entered the correct API key.',
                    color: 'red',
                });
            }
            this.isTablesLoading = false;
        },
    },
};
</script>

<style scoped lang="scss">
.relative {
    position: relative;
}
</style>
