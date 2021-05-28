<template>
    <div class="collection-summary">
        <div class="collection-summary__elem caption-s">Base: {{ config.baseName || '-' }}</div>
        <div class="collection-summary__elem caption-s">Table: {{ config.tableName || '-' }}</div>
        <div class="collection-summary__elem caption-s">View: {{ config.view || '-' }}</div>
    </div>
</template>

<script>
export default {
    props: {
        plugin: { type: Object, required: true },
        config: { type: Object, required: true },
    },
    watch: {
        isSetup: {
            immediate: true,
            handler(value) {
                this.$emit('update-is-valid', value);
            },
        },
    },
    computed: {
        isSetup() {
            return !!this.config.baseId && !!this.config.tableId && !!this.config.view;
        },
    },
};
</script>

<style lang="scss" scoped>
.collection-summary {
    &__elem {
        margin-bottom: var(--ww-spacing-01);
    }
}
</style>
