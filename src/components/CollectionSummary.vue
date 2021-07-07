<template>
    <div class="airtable-collection-summary">
        <div class="airtable-collection-summary__elem caption-s">Base: {{ config.baseName || '-' }}</div>
        <div class="airtable-collection-summary__elem caption-s">Table: {{ config.tableName || '-' }}</div>
        <div class="airtable-collection-summary__elem caption-s">View: {{ config.view || '-' }}</div>
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
    &__elem {
        margin-bottom: var(--ww-spacing-01);
    }
}
</style>
