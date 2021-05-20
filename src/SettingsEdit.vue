<template>
    <div class="airtable-settings">
        <wwEditorFormRow required label="API key">
            <template slot="append-label">
                <a class="airtable-settings__link" href="https://airtable.com/account" target="_blank">Find it here</a>
            </template>
            <wwEditorFormInput
                type="text"
                name="api-key"
                placeholder="key**************"
                :value="settings.privateData.apiKey"
                @input="changeApiKey"
                :style="{ '-webkit-text-security': isKeyHidden ? 'disc' : 'none' }"
            />
        </wwEditorFormRow>
        <div class="airtable-settings__row">
            <wwManagerRadio :value="!isKeyHidden" @input="isKeyHidden = !$event" />
            <span class="airtable-settings__radio-label caption-m">Show api key</span>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        settings: { type: Object, required: true },
    },
    data() {
        return {
            isKeyHidden: true,
        };
    },
    watch: {
        isValid: {
            immediate: true,
            handler(value) {
                this.$emit('update-is-valid', value);
            },
        },
    },
    computed: {
        isValid() {
            if (!this.settings) return false;
            if (!this.settings.privateData) return false;
            return !!this.settings.privateData.apiKey;
        },
    },
    methods: {
        changeApiKey(apiKey) {
            this.$emit('update-settings', { ...this.settings, privateData: { apiKey } });
        },
    },
};
</script>

<style lang="scss" scoped>
.airtable-settings {
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
