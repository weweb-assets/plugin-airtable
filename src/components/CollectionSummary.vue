<template>
    <div class="airtable-collection-summary">
        <div v-show="config.baseId" class="airtable-collection-summary__elem caption-s">
            Base: {{ config.baseName || '-' }}
        </div>
        <div v-show="config.tableId" class="airtable-collection-summary__elem caption-s">
            Table: {{ config.tableName || '-' }}
        </div>
        <div v-show="config.view" class="airtable-collection-summary__elem caption-s">
            View: {{ config.view || '-' }}
        </div>
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
