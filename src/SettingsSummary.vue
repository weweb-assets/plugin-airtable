<template>
    <div class="settings-summary">
        <wwEditorIcon large name="key" class="settings-summary__icon"></wwEditorIcon>
        <span class="caption-m">********</span>
    </div>
</template>

<script>
export default {
    props: {
        settings: { type: Object, required: true },
    },
};
</script>

<style lang="scss" scoped>
.settings-summary {
    display: flex;
    align-items: baseline;
    &__icon {
        margin-right: var(--ww-spacing-02);
    }
}
</style>
