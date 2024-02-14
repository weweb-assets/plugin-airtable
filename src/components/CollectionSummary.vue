<template>
    <div class="airtable-collection-summary">
        <div class="label-sm content-primary">Base</div>
        <div class="body-sm content-secondary">{{ config.baseName || '-' }}</div>
        <div class="label-sm content-primary">Table</div>
        <div class="body-sm content-secondary truncate">{{ config.tableName || '-' }}</div>
        <div class="label-sm content-primary">View</div>
        <div class="body-sm content-secondary truncate">{{ config.view || '-' }}</div>
    </div>
</template>

<script>
export default {
    props: {
        config: { type: Object, required: true },
    },
};
</script>

<style lang="scss" scoped>
.airtable-collection-summary {
    display: grid;
    grid-template-columns: 0fr 1fr;
    column-gap: var(--ww-spacing-02);
    row-gap: var(--ww-spacing-02);
}
</style>
