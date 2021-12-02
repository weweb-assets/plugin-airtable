<template>
    <wwEditorFormRow label="Collection" required>
        <wwEditorInputTextSelect
            :options="collectionOptions"
            :model-value="collectionId"
            placeholder="Select a collection"
            large
            @update:modelValue="setCollectionId"
        />
    </wwEditorFormRow>
    <wwEditorFormRow label="Record ID" required>
        <wwEditorInput
            type="query"
            :model-value="recordId"
            placeholder="Enter a record ID"
            large
            bindable
            @update:modelValue="setRecordId"
        />
    </wwEditorFormRow>
</template>

<script>
export default {
    props: {
        plugin: { type: Object, required: true },
        args: { type: Array, default: () => [null, null] },
    },
    emits: ['update:args'],
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
        recordId() {
            return this.args[1];
        },
    },
    methods: {
        setCollectionId(collectionId) {
            this.$emit('update:args', [collectionId, this.recordId]);
        },
        setRecordId(recordId) {
            this.$emit('update:args', [this.collectionId, recordId]);
        },
    },
};
</script>
