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
        <wwEditorInputRow
            label="Fields"
            required
            type="select"
            multiple
            :options="tableFieldsOptions"
            :model-value="fields"
            placeholder="All fields"
            @update:modelValue="setFields"
        />
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
                @update:modelValue="setDataKey(field.label, $event)"
                @add-item="addItem(field)"
            >
                <template v-if="typesConvertion[field.type] === 'object'" #default="{ item, setItem }">
                    <template v-if="field.type === 'singleCollaborator'">
                        <wwEditorInputRow
                            type="query"
                            :model-value="item && item.id"
                            label="ID"
                            placeholder="Enter a user ID"
                            bindable
                            small
                            @update:modelValue="setDataKey(field.label, { ...(item || {}), id: $event })"
                        />
                        <wwEditorInputRow
                            type="query"
                            :model-value="item && item.email"
                            label="Email"
                            placeholder="Enter a user email"
                            bindable
                            small
                            @update:modelValue="setDataKey(field.label, { ...(item || {}), email: $event })"
                        />
                    </template>
                </template>
                <template v-else-if="typesConvertion[field.type] === 'array'" #default="{ item, setItem }">
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
                    <template v-else-if="field.type === 'multipleAttachments'">
                        <wwEditorInputRow
                            type="query"
                            :model-value="item.url"
                            label="URL"
                            placeholder="Enter a value"
                            bindable
                            small
                            @update:modelValue="setItem({ ...item, url: $event })"
                        />
                        <wwEditorInputRow
                            type="query"
                            :model-value="item.filename"
                            label="Filename"
                            placeholder="Enter a value"
                            bindable
                            small
                            @update:modelValue="setItem({ ...item, filename: $event })"
                        />
                    </template>
                    <template v-else-if="field.type === 'multipleCollaborators'">
                        <wwEditorInputRow
                            type="query"
                            :model-value="item.id"
                            label="ID"
                            placeholder="Enter a user ID"
                            bindable
                            small
                            @update:modelValue="setItem({ ...item, id: $event })"
                        />
                        <wwEditorInputRow
                            type="query"
                            :model-value="item.email"
                            label="Email"
                            placeholder="Enter a user email"
                            bindable
                            small
                            @update:modelValue="setItem({ ...item, email: $event })"
                        />
                    </template>
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
        args: { type: Object, required: true },
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
                singleCollaborator: 'object',
                date: 'query',
                dateTime: 'query',
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
                multipleCollaborators: 'array',
            },
        };
    },
    computed: {
        collectionOptions() {
            const collections = wwLib.$store.getters['data/getCollections'];
            const plugins = wwLib.$store.getters['websiteData/getPluginById'];
            return Object.values(collections)
                .filter(collection => plugins(collection.pluginId).namespace === 'airtable')
                .map(collection => ({
                    label: collection.name,
                    value: collection.id,
                    icon: `logos/${plugins(collection.pluginId).namespace}`,
                }));
        },
        collectionId() {
            return this.args.collectionId;
        },
        collection() {
            return wwLib.$store.getters['data/getCollections'][this.collectionId];
        },
        recordId() {
            return this.args.recordId;
        },
        fields() {
            return this.args.fields;
        },
        data() {
            return this.args.data || {};
        },
        tableFields() {
            if (!this.collection) return [];
            const table = this.allTables.find(table => table.id === this.collection.config.tableId);
            if (!table) return [];
            return table.fields
                .filter(field => this.typesConvertion[field.type])
                .map(field => ({
                    label: field.name,
                    type: field.type,
                    options: ((field.options && field.options.choices) || []).map(choice => ({
                        value: choice.name,
                        label: choice.name,
                    })),
                }))
                .filter(field => !this.fields || !this.fields.length || this.fields.includes(field.label));
        },
        tableFieldsOptions() {
            if (!this.collection) return [];
            const table = this.allTables.find(table => table.id === this.collection.config.tableId);
            if (!table) return [];
            return table.fields
                .filter(field => this.typesConvertion[field.type])
                .map(field => ({ label: field.name, value: field.name }));
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
                this.setDataKey(field.label, [...(this.data[field.label] || []), { url: '' }]);
            else this.setDataKey(field.label, [...(this.data[field.label] || []), '']);
        },
        setCollectionId(collectionId) {
            this.$emit('update:args', { ...this.args, collectionId, fields: [], data: {} });
        },
        setRecordId(recordId) {
            this.$emit('update:args', { ...this.args, recordId });
        },
        setFields(fields) {
            this.$emit('update:args', { ...this.args, fields });
            this.$nextTick(() => this.setData({ ...this.data }));
        },
        setDataKey(key, value) {
            this.setData({ ...this.data, [key]: value });
        },
        setData(data) {
            for (const dataKey in data) {
                if (!this.tableFields.find(field => field.label === dataKey)) {
                    delete data[dataKey];
                }
            }
            for (const field of this.tableFields) {
                data[field.label] = data[field.label] || null;
            }
            this.$emit('update:args', { ...this.args, data });
        },
        async getTables(isNoCache = false) {
            if (!this.collection || !this.collection.config.baseId) return;
            this.isTablesLoading = true;
            try {
                this.allTables = await this.plugin.getTables(this.collection.config.baseId, isNoCache);
                this.setData({ ...this.data });
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
