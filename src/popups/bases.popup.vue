<template>
    <div class="ww-popup-settings">
        <button class="settings__add-base ww-editor-button -primary" @click="addBase">Add base</button>
        <div class="settings" v-for="(base, index) in settings.privateData.bases" :key="index">
            <div class="settings__row -bases settings__label">
                <div class="paragraph-l">Base</div>
                <button class="ww-editor-button -primary -red -small" @click="deleteBase(base)">Delete base</button>
            </div>
            <div class="settings__row -bases">
                <div class="settings__col">
                    <label class="settings__label caption-s" for="">
                        Base key
                        <a class="settings__link" href="https://airtable.com/api" target="_blank"> Find it here </a>
                    </label>
                    <input
                        type="text"
                        class="settings__input ww-editor-input -large"
                        placeholder="Key"
                        v-model="base.name"
                    />
                </div>
                <div class="settings__col m-left">
                    <label class="settings__label caption-s" for="">Name in weweb</label>
                    <div class="settings__row">
                        <input
                            type="text"
                            class="settings__input ww-editor-input -large"
                            placeholder="Display name"
                            v-model="base.displayName"
                        />
                    </div>
                </div>
            </div>
            <div class="settings__row -tables">
                <div class="paragraph-m settings__label">Tables</div>
                <button class="ww-editor-button -primary -small" @click="addTable(base)">Add table</button>
            </div>
            <div class="settings__row -tables" v-for="(table, index) in base.tables" :key="index">
                <div class="settings__col">
                    <label class="settings__label caption-s" for="">Name in Airtable</label>
                    <input
                        type="text"
                        class="settings__input ww-editor-input -large"
                        placeholder="Table name"
                        v-model="table.name"
                    />
                </div>
                <div class="settings__col m-left">
                    <label class="settings__label caption-s" for="">Name in weweb</label>
                    <input
                        type="text"
                        class="settings__input ww-editor-input -large"
                        placeholder="Display name"
                        v-model="table.displayName"
                    />
                </div>
                <div class="settings__col m-left">
                    <label class="settings__label caption-s" for="">Table display by</label>
                    <div class="settings__row">
                        <input
                            type="text"
                            class="settings__input ww-editor-input -large"
                            placeholder="Key displayed"
                            v-model="table.displayBy"
                        />
                        <div type="button" class="settings__button m-left" @click="deleteTable(base, index)">
                            <wwEditorIcon name="delete" small />
                        </div>
                    </div>
                </div>
            </div>
            <div class="settings__separator"></div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'TablesPopup',
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
            settings: {
                privateData: {
                    apiKey: '',
                    bases: [],
                },
            },
        };
    },
    methods: {
        addBase() {
            this.settings.privateData.bases.unshift({ tables: [{ id: wwLib.wwUtils.getUid() }] });
        },
        deleteBase(index) {
            this.settings.privateData.bases.splice(index, 1);
        },
        addTable(base) {
            base.tables.push({ id: wwLib.wwUtils.getUid() });
        },
        deleteTable(base, index) {
            base.tables.splice(index, 1);
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
        this.settings = this.options.data.settings || this.settings;
        this.options.result.settings = this.settings;
    },
};
</script>

<style scoped lang="scss">
.ww-popup-settings {
    position: relative;
    display: flex;
    flex-direction: column;
    padding: var(--ww-spacing-03) 0;
    .settings {
        &:not(:last-child) {
            .settings__separator {
                margin: var(--ww-spacing-04);
                border-bottom: 2px solid var(--ww-color-dark-300);
            }
        }
        &__link {
            color: var(--ww-color-blue-500);
            margin-left: var(--ww-spacing-02);
        }
        &__add-base {
            margin: var(--ww-spacing-03) 0;
        }
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
        &__input {
            width: 100%;
            margin-bottom: var(--ww-spacing-03);
        }
        &__button {
            margin: 0 var(--ww-spacing-03);
            margin-bottom: var(--ww-spacing-03);
            cursor: pointer;
            &:hover {
                color: var(--ww-color-red-500);
            }
        }
        &__row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            &.-bases {
                margin: var(--ww-spacing-02) 0;
            }
            &.-tables {
                margin: var(--ww-spacing-01) var(--ww-spacing-04);
            }
        }
        &__col {
            width: 100%;
        }
    }
    .m-left {
        margin-left: var(--ww-spacing-03);
    }
}
</style>
