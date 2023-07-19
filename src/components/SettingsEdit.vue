<template>
    <div class="airtable-settings-edit">
        <wwEditorFormRow required label="API key">
            <template #append-label>
                <a class="airtable-settings-edit__link" href="https://airtable.com/create/tokens" target="_blank">
                    Find it here
                </a>
            </template>
            <div class="flex items-center">
                <wwEditorInputText
                    :type="isKeyVisible ? 'text' : 'password'"
                    name="Personal Access Token"
                    placeholder="key**************"
                    :model-value="settings.privateData.apiKey"
                    large
                    @update:modelValue="changeApiKey"
                    class="w-full mr-3"
                />
                <button class="pointer" @click.prevent="isKeyVisible = !isKeyVisible">
                    <wwEditorIcon :name="isKeyVisible ? 'eye-off' : 'eye'"></wwEditorIcon>
                </button>
                <wwEditorQuestionMark
                    tooltip-position="top-left"
                    class="ml-2"
                    :forcedContent="`Make sure to set proper read and write permissions on your token and access to the right bases. So that WeWeb can fetch your bases schema and data. More info on scopes here: https://airtable.com/developers/web/api/scopes`"
                />
            </div>
        </wwEditorFormRow>
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
