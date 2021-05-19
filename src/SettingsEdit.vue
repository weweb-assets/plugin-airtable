<template>
    <div class="ww-popup-airtable-configuration">
        <label class="airtable-configuration__label caption-s" for="api-key">
            API key
            <a class="airtable-configuration__link" href="https://airtable.com/account" target="_blank">Find it here</a>
            <div class="airtable-configuration__label-required">required</div>
        </label>
        <input
            type="text"
            name="api-key"
            class="airtable-configuration__input caption-m ww-editor-input -large"
            placeholder="key**************"
            :value="settings.privateData.apiKey"
            @input="changeApiKey($event.target.value)"
            :style="{ '-webkit-text-security': isKeyHidden ? 'disc' : 'none' }"
        />
        <div class="airtable-configuration__row">
            <wwManagerRadio :value="!isKeyHidden" @input="isKeyHidden = !$event" />
            <span class="airtable-configuration__radio-label caption-m">Show api key</span>
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

<style scoped lang="scss">
.ww-popup-airtable-configuration {
    position: relative;
    display: flex;
    flex-direction: column;
    padding: var(--ww-spacing-03) 0;
    .airtable-configuration {
        &__label {
            display: flex;
            align-items: center;
            font-weight: 500;
            color: var(--ww-color-dark-500);
            margin-bottom: var(--ww-spacing-01);
            &-required {
                margin-left: auto;
                color: var(--ww-color-dark-400);
            }
        }
        &__link {
            color: var(--ww-color-blue-500);
            margin-left: var(--ww-spacing-02);
        }
        &__input {
            margin-bottom: var(--ww-spacing-03);
        }
        &__row {
            display: flex;
            align-items: center;
        }
        &__radio-label {
            margin-left: var(--ww-spacing-02);
        }
    }
}
</style>
