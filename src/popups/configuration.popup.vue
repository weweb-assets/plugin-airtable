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
            v-model="settings.privateData.apiKey"
            :style="{ '-webkit-text-security': isKeyHidden ? 'disc' : 'none' }"
        />
        <div class="airtable-configuration__row">
            <wwManagerRadio :value="!isKeyHidden" @input="isKeyHidden = !$event" />
            <span class="airtable-configuration__radio-label caption-m">Show api key</span>
        </div>
        <div class="airtable-configuration__delete-zone danger-zone">
            <span class="airtable-configuration__delete-zone-label">DANGER ZONE</span>
            <button
                class="airtable-configuration__delete-zone-button ww-editor-button -primary -red -small"
                @click="deletePlugin"
            >
                Delete plugin
            </button>
        </div>
    </div>
</template>

<script>
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
                privateData: {},
            },
        };
    },
    watch: {
        isSetup() {
            this.options.setButtonState('SAVE', this.isSetup ? 'ok' : 'disabled');
        },
    },
    computed: {
        isSetup() {
            return this.settings.privateData.apiKey && this.settings.privateData.apiKey.length;
        },
    },
    methods: {
        async deletePlugin() {
            const plugin = wwLib.wwPlugins.pluginAirtable;
            const confirm = await wwLib.wwModals.open({
                title: {
                    en: 'Delete plugin Airtable?',
                    fr: 'Supprimer le plugin Airtable ?',
                },
                text: {
                    en: 'Are you sure you want to delete the plugin from your website?',
                    fr: 'Voulez-vous vraiment supprimer le plugin de votre site ?',
                },
                buttons: [
                    {
                        text: {
                            en: 'Cancel',
                            fr: 'Annuler',
                        },
                        color: '-secondary',
                        value: false,
                        escape: true,
                    },
                    {
                        text: {
                            en: 'Delete',
                            fr: 'Supprimer',
                        },
                        color: '-primary -red',
                        value: true,
                        enter: true,
                    },
                ],
            });
            if (!confirm) return;
            await wwLib.wwPlugin.deleteDesignPlugin(plugin.id);
        },
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
        this.settings = this.options.data.settings;
        this.options.result.settings = this.settings;
        this.options.setButtonState('SAVE', this.isSetup ? 'ok' : 'disabled');
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
        &__delete-zone {
            margin-top: auto;
            &-label {
                width: 100%;
                font-size: var(--ww-font-size-04);
                color: var(--ww-color-red-500);
            }
            &-button {
                margin-top: var(--ww-spacing-02);
                margin-right: var(--ww-spacing-02);
            }
        }
    }
}
</style>
