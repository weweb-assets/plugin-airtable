<template>
    <div class="airtable-settings-summary">
        <wwEditorIcon large name="key" class="airtable-settings-summary__icon" />
        <span class="caption-m">{{ apiKey }}</span>
    </div>
</template>

<script>
export default {
    props: {
        settings: { type: Object, required: true },
    },
    computed: {
        apiKey() {
            const apiKey = this.settings.privateData.apiKey || '';
            return apiKey.replace(/./g, '*');
        },
    },
};
</script>

<style lang="scss" scoped>
.airtable-settings-summary {
    display: flex;
    align-items: baseline;
    overflow-x: clip;
    &__icon {
        margin-right: var(--ww-spacing-02);
    }
}
</style>
