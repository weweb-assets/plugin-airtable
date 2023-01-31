export default {
    editor: {
        settings: {
            edit: () => import('./src/components/SettingsEdit.vue'),
            summary: () => import('./src/components/SettingsSummary.vue'),
            getIsValid(settings) {
                return !!settings.privateData.apiKey;
            },
        },
        collection: {
            edit: () => import('./src/components/CollectionEdit.vue'),
            summary: () => import('./src/components/CollectionSummary.vue'),
            getIsValid(config) {
                return !!config.baseId && !!config.tableId && !!config.view;
            },
            queryConfig: {
                hasNativePagination: true,
                hasNativeSort: true,
                hasNativeFilter: true,
                filterOperators: [
                    { label: 'Is', value: '$eq', acceptedTypes: ['string', 'boolean'] },
                    { label: 'Is not', value: '$ne', acceptedTypes: ['string', 'boolean'] },
                    { label: '=', value: '$eq', acceptedTypes: ['number'] },
                    { label: '≠', value: '$ne', acceptedTypes: ['number'] },
                    { label: '<', value: '$lt', acceptedTypes: ['number'] },
                    { label: '>', value: '$gt', acceptedTypes: ['number'] },
                    { label: '≤', value: '$lte', acceptedTypes: ['number'] },
                    { label: '≥', value: '$gte', acceptedTypes: ['number'] },
                    {
                        label: 'Contains',
                        value: '$iLike:contains',
                        acceptedTypes: ['string', 'array', 'number', 'object'],
                        defaultValue: '',
                    },
                    {
                        label: 'Does not contain',
                        value: '$notILike:contains',
                        acceptedTypes: ['string', 'array', 'number', 'object'],
                        defaultValue: '',
                    },
                    {
                        label: 'Starts with',
                        value: '$iLike:startsWith',
                        acceptedTypes: ['string'],
                        defaultValue: 'start',
                    },
                    { label: 'Ends with', value: '$iLike:endsWith', acceptedTypes: ['string'], defaultValue: 'end' },
                    { label: 'Is exactly', value: '$eq', acceptedTypes: ['array', 'object'] },
                    { label: 'Is empty', value: '$eq:null', acceptedTypes: ['string', 'number', 'array', 'object'] },
                    {
                        label: 'Is not empty',
                        value: '$ne:null',
                        acceptedTypes: ['string', 'number', 'array', 'object'],
                    },
                    { label: 'Is in', value: '$in', acceptedTypes: ['string', 'number'], defaultValue: [] },
                    { label: 'Is not in', value: '$notIn', acceptedTypes: ['string', 'number'], defaultValue: [] },
                    { label: 'Has any of', value: '$overlap', acceptedTypes: ['array'], defaultValue: [] },
                    { label: 'Has none of', value: '$notOverlap', acceptedTypes: ['array'], defaultValue: [] },
                    { label: 'Has all of', value: '$contains', acceptedTypes: ['array'], defaultValue: [] },
                    { label: 'Regex match', value: '$match', acceptedTypes: ['string'] },
                    { label: 'Regex not match', value: '$notMatch', acceptedTypes: ['string'] },
                ],
                typeDefaultOperator: {
                    string: '$iLike:contains',
                    number: '$eq',
                    object: '$has', // TODO + $eq conflict
                    array: '$contains',
                    boolean: '$eq',
                },
            },
        },
    },
    actions: [
        {
            name: 'Create a record',
            code: 'createRecord',
            isAsync: true,
            /* wwEditor:start */
            edit: () => import('./src/components/RecordCreate.vue'),
            getIsValid({ collectionId, data }) {
                return !!collectionId && !!data;
            },
            /* wwEditor:end */
        },
        {
            name: 'Update a record',
            code: 'updateRecord',
            isAsync: true,
            /* wwEditor:start */
            edit: () => import('./src/components/RecordUpdate.vue'),
            getIsValid({ collectionId, recordId, data }) {
                return !!collectionId && !!recordId && !!data;
            },
            /* wwEditor:end */
        },
        {
            name: 'Delete a record',
            code: 'deleteRecord',
            isAsync: true,
            /* wwEditor:start */
            edit: () => import('./src/components/RecordDelete.vue'),
            getIsValid({ collectionId, recordId }) {
                return !!collectionId && !!recordId;
            },
            /* wwEditor:end */
        },
        {
            name: 'Sync a record',
            code: 'syncRecord',
            isAsync: true,
            /* wwEditor:start */
            edit: () => import('./src/components/RecordSync.vue'),
            getIsValid({ collectionId, recordId }) {
                return !!collectionId && !!recordId;
            },
            /* wwEditor:end */
        },
    ],
};
