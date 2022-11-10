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
</template>

<script>
export default {
    props: {
        plugin: { type: Object, required: true },
        args: { type: Object, required: true },
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
                    icon: `logos/${plugins(collection.pluginId).name}`,
                }));
        },
        collectionId() {
            return this.args.collectionId;
        },
        recordId() {
            return this.args.recordId;
        },
    },
    methods: {
        setCollectionId(collectionId) {
            this.$emit('update:args', { ...this.args, collectionId });
        },
        setRecordId(recordId) {
            this.$emit('update:args', { ...this.args, recordId });
        },
    },
};
</script>
