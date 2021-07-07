<template>
    <div class="airtable-settings-edit">
        <wwEditorFormRow required label="API key">
            <template #append-label>
                <a class="airtable-settings-edit__link" href="https://airtable.com/account" target="_blank">
                    Find it here
                </a>
            </template>
            <wwEditorFormInput
                type="text"
                name="api-key"
                placeholder="key**************"
                :model-value="settings.privateData.apiKey"
                :style="{ '-webkit-text-security': isKeyVisible ? 'none' : 'disc' }"
                large
                @update:modelValue="changeApiKey"
            />
        </wwEditorFormRow>
        <div class="airtable-settings-edit__row">
            <wwManagerRadio v-model="isKeyVisible" />
            <span class="airtable-settings-edit__radio-label caption-m">Show api key</span>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        settings: { type: Object, required: true },
    },
    emits: ['update:settings'],
    data() {
        return {
            isKeyVisible: false,
        };
    },
    methods: {
        changeApiKey(apiKey) {
            this.$emit('update:settings', { ...this.settings, privateData: { apiKey } });
        },
    },
};
</script>

<style lang="scss" scoped>
.airtable-settings-edit {
    display: flex;
    flex-direction: column;
    &__link {
        color: var(--ww-color-blue-500);
        margin-left: var(--ww-spacing-02);
    }
    &__row {
        display: flex;
        align-items: center;
    }
    &__radio-label {
        margin-left: var(--ww-spacing-02);
    }
}
</style>
