<template>
    <div class="ww-popup-airtable-table">
        <label class="airtable-table__label caption-s" for="name-airtable">
            Name in Airtable
            <div class="airtable-table__label-required">required</div>
        </label>
        <input
            type="text"
            name="name-airtable"
            class="airtable-table__input caption-m ww-editor-input -large"
            placeholder="Name"
            v-model="table.name"
        />
        <label class="airtable-table__label caption-s" for="name-weweb"> Name in weweb </label>
        <input
            type="text"
            name="name-weweb"
            class="airtable-table__input caption-m ww-editor-input -large"
            placeholder="Display name"
            v-model="table.displayName"
        />
        <label class="airtable-table__label caption-s" for="display-by"> Display by </label>
        <input
            type="text"
            name="display-by"
            class="airtable-table__input caption-m ww-editor-input -large"
            placeholder="Display by"
            v-model="table.displayBy"
        />
        <label class="airtable-table__label caption-s" for="table-view"> View </label>
        <input
            type="text"
            name="table-view"
            class="airtable-table__input caption-m ww-editor-input -large"
            placeholder="Grid view"
            v-model="table.view"
        />
        <label class="airtable-table__label caption-s" for="filter-formula">
            Filter by formula
            <a
                class="airtable-table__link"
                href="//support.airtable.com/hc/en-us/articles/203255215-Formula-field-reference"
                target="_blank"
            >
                Find it here
            </a>
        </label>
        <input
            type="text"
            name="filter-formula"
            class="airtable-table__input caption-m ww-editor-input -large"
            placeholder="{Name} = 'Mr Toucan'"
            v-model="table.filterByFormula"
        />
        <div class="airtable-table__row airtable-table__input">
            <label class="airtable-table__label caption-s" for="table-view"> Sort </label>
            <button class="ww-editor-button -primary -small m-auto-left" @click="addSort">
                Add a field to sort by
            </button>
        </div>
        <div
            class="airtable-table__row -space-between airtable-table__input"
            v-for="(sort, index) in table.sort"
            :key="index"
        >
            <div class="caption-s" v-if="!index">Sort by</div>
            <div class="caption-s" v-else>then by</div>
            <input
                type="text"
                name="sort-field"
                class="caption-m ww-editor-input"
                placeholder="Field"
                v-model="sort.field"
            />
            <wwEditorSelect
                class="airtable-table__select"
                :options="directionOptions"
                :value="sort.direction"
                @input="updateSort(sort, $event)"
            />
            <div class="airtable-table__button-delete" @click="deleteSort(index)">
                <wwEditorIcon name="delete" small />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'TablePopup',
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
            directionOptions: [
                { value: 'asc', label: 'Asc', default: true },
                { value: 'desc', label: 'Desc' },
            ],
            table: {
                id: wwLib.wwUtils.getUid(),
                name: '',
                sort: [],
            },
        };
    },
    watch: {
        'table.name'() {
            this.options.setButtonState('SAVE', this.table.name.length ? 'ok' : 'disabled');
        },
    },
    methods: {
        addSort() {
            if (!this.table.sort) this.table.sort = [];
            this.table.sort.push({ field: '', direction: 'asc' });
            this.$forceUpdate();
        },
        updateSort(sort, event) {
            sort.direction = event;
            this.$forceUpdate();
        },
        deleteSort(index) {
            this.table.sort.splice(index, 1);
            this.$forceUpdate();
        },
    },
    created() {
        this.table = this.options.data.table || this.table;
        this.options.result.table = this.table;
        this.options.setButtonState('SAVE', this.table.name.length ? 'ok' : 'disabled');
    },
};
</script>

<style scoped lang="scss">
.ww-popup-airtable-table {
    position: relative;
    display: flex;
    flex-direction: column;
    padding: var(--ww-spacing-03) 0;
    .airtable-table {
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
        &__select {
            min-width: 65px;
            margin-left: var(--ww-spacing-02);
        }
        &__row {
            display: flex;
            align-items: center;
            &.-space-between {
                justify-content: space-between;
                padding: 0 var(--ww-spacing-05);
            }
        }
        &__button-delete {
            margin-right: var(--ww-spacing-03);
            cursor: pointer;
            transition: color 0.3s ease;
            &:hover {
                color: var(--ww-color-red-500);
            }
        }
    }
    .m-auto-left {
        margin-left: auto;
    }
}
</style>
