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
        },
    },
    functions: [
        {
            name: 'Create a record',
            code: 'createRecord',
            parameters: [
                { name: 'collectionId', type: 'string' },
                { name: 'recordData', type: 'object', optional: true },
            ],
            isAsync: true,
            /* wwEditor:start */
            edit: () => import('./src/components/RecordCreate.vue'),
            getIsValid([collectionId, recordData]) {
                return !!collectionId && !!recordData;
            },
            /* wwEditor:end */
        },
        {
            name: 'Update a record',
            code: 'updateRecord',
            parameters: [
                { name: 'collectionId', type: 'string' },
                { name: 'recordId', type: 'string' },
                { name: 'recordData', type: 'object', optional: true },
            ],
            isAsync: true,
            /* wwEditor:start */
            edit: () => import('./src/components/RecordUpdate.vue'),
            getIsValid([collectionId, recordId, recordData]) {
                return !!collectionId && !!recordId && !!recordData;
            },
            /* wwEditor:end */
        },
        {
            name: 'Delete a record',
            code: 'deleteRecord',
            parameters: [
                { name: 'collectionId', type: 'string' },
                { name: 'recordId', type: 'string' },
            ],
            isAsync: true,
            /* wwEditor:start */
            edit: () => import('./src/components/RecordDelete.vue'),
            getIsValid([collectionId, recordId]) {
                return !!collectionId && !!recordId;
            },
            /* wwEditor:end */
        },
        {
            name: 'Sync a record',
            code: 'syncRecord',
            parameters: [
                { name: 'collectionId', type: 'string' },
                { name: 'recordId', type: 'string' },
            ],
            isAsync: true,
            /* wwEditor:start */
            edit: () => import('./src/components/RecordSync.vue'),
            getIsValid([collectionId, recordId]) {
                return !!collectionId && !!recordId;
            },
            /* wwEditor:end */
        },
    ],
};
