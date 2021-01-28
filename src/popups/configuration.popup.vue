<template>
    <div class="ww-popup-settings-configuration">
        <label class="settings-configuration__label caption-s" for="api-key">
            Api key
            <a class="settings-configuration__link" href="https://airtable.com/account" target="_blank">Find it here</a>
            <div class="settings-configuration__label-required">required</div>
        </label>
        <input
            :type="isKeyHidden ? 'password' : 'text'"
            name="api-key"
            class="settings-configuration__input caption-m ww-editor-input -large"
            placeholder="Api Key"
            v-model="settings.privateData.apiKey"
        />
        <div class="settings-configuration__row">
            <wwManagerRadio :value="!isKeyHidden" @input="isKeyHidden = !$event" />
            <span class="settings-configuration__radio-label caption-m">Show api key</span>
        </div>
    </div>
</template>

<script>
import api from '../api';

export default {
    name: 'ConfigurationPopup',
    props: {
        options: {
            type: Object,
            default() {
                return {};
            },
        },
    },
    data() {
        return {
            isKeyHidden: true,
            settings: {
                privateData: {
                    apiKey: '',
                    bases: [],
                },
            },
        };
    },
    watch: {
        'settings.privateData.apiKey'() {
            api.configure(this.settings.privateData.apiKey);
        },
    },
    methods: {
        async beforeNext() {
            this.options.setLoadingStatus(true);
            try {
                const plugin = wwLib.wwPlugins.pluginAirtable;
                plugin.settings = await wwLib.wwPlugin.saveSettings(
                    plugin.id,
                    plugin.settings.id,
                    this.settings.data,
                    this.settings.privateData
                );
            } catch (err) {
                wwLib.wwLog.error(err);
            }
            this.options.setLoadingStatus(false);
        },
    },
    created() {
        this.settings = this.options.data.settings || this.settings;
        this.options.result.settings = this.settings;
    },
};
</script>

<style scoped lang="scss">
.ww-popup-settings-configuration {
    position: relative;
    display: flex;
    flex-direction: column;
    padding: var(--ww-spacing-03) 0;
    .settings-configuration {
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
