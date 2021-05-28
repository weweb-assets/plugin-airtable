<template>
    <div class="settings-summary" v-if="isValid">
        <wwEditorIcon large name="key" class="settings-summary__icon"></wwEditorIcon>
        <span class="caption-m">********</span>
    </div>
</template>

<script>
export default {
    props: {
        plugin: { type: Object, required: true },
        settings: { type: Object, required: true },
    },
    computed: {
        isValid() {
            return !!this.settings.privateData.apiKey;
        },
    },
    watch: {
        isValid: {
            immediate: true,
            handler(value) {
                this.$emit('update-is-valid', value);
            },
        },
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
