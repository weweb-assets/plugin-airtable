<template>
    <div class="ww-popup-airtable-base">
        <label class="airtable-base__label caption-s" for="base-key">
            Base key
            <a class="airtable-base__link" href="https://airtable.com/api" target="_blank">Find it here</a>
            <div class="airtable-base__label-required">required</div>
        </label>
        <input
            type="text"
            name="base-key"
            class="airtable-base__input caption-m ww-editor-input -large"
            placeholder="app**************"
            v-model="base.name"
        />
        <label class="airtable-base__label caption-s" for="base-name">
            Name in weweb
            <div class="airtable-base__label-required">optional</div>
        </label>
        <input
            type="text"
            name="base-name"
            class="airtable-base__input caption-m ww-editor-input -large"
            placeholder="Display name"
            v-model="base.displayName"
        />
    </div>
</template>

<script>
export default {
    name: 'BasePopup',
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
            base: {
                name: '',
                tables: [],
            },
        };
    },
    watch: {
        'base.name'() {
            this.options.setButtonState('SAVE', this.base.name.length ? 'ok' : 'disabled');
        },
    },
    created() {
        this.base = this.options.data.base || this.base;
        this.options.result.base = this.base;
        this.options.setButtonState('SAVE', this.base.name.length ? 'ok' : 'disabled');
    },
};
</script>

<style scoped lang="scss">
.ww-popup-airtable-base {
    position: relative;
    display: flex;
    flex-direction: column;
    padding: var(--ww-spacing-03) 0;
    .airtable-base {
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
    }
}
</style>
