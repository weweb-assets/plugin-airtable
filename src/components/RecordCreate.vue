<template>
    <wwEditorFormRow label="Collection" required>
        <wwEditorInputTextSelect
            :options="collectionOptions"
            :model-value="collectionId"
            placeholder="Select a collection"
            @update:modelValue="setCollectionId"
        />
    </wwEditorFormRow>
    <div v-if="collection" class="relative">
        <div v-for="field of tableFields" :key="field.label">
            <wwEditorInputRow
                v-if="typesConvertion[field.type]"
                placeholder="Enter a value"
                :type="typesConvertion[field.type]"
                :model-value="data[field.label]"
                :options="field.options"
                :label="field.label"
                bindable
                @update:modelValue="setRecordData(field.label, $event)"
                @add-item="setRecordData(field.label, [...(data[field.label] || []), ''])"
            >
                <template v-if="field.type === 'multipleRecordLinks'" #default="{ item, setItem }">
                    <wwEditorFormRow>
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
        args: { type: Array, default: () => [null, {}] },
    },
    emits: ['update:args'],
    data() {
        return {
            isTablesLoading: false,
            allTables: [],
            typesConvertion: {
                singleLineText: 'query',
                multilineText: 'query',
                checkbox: 'boolean',
                richText: 'query',
                multipleSelects: 'select',
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
        data() {
            return this.args[1];
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
        setCollectionId(collectionId) {
            this.$emit('update:args', [collectionId, this.data]);
        },
        setRecordData(key, value) {
            const data = { ...this.data, [key]: value };
            for (const dataKey in data) {
                if (!this.tableFields.find(field => field.label === dataKey)) {
                    delete data[dataKey];
                }
            }
            this.$emit('update:args', [this.collectionId, data]);
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
