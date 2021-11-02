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
        },
        {
            name: 'Delete a record',
            code: 'deleteRecord',
            parameters: [
                { name: 'collectionId', type: 'string' },
                { name: 'recordId', type: 'string' },
            ],
            isAsync: true,
        },
        {
            name: 'Sync a record',
            code: 'syncRecord',
            parameters: [
                { name: 'collectionId', type: 'string' },
                { name: 'recordId', type: 'string' },
            ],
            isAsync: true,
        },
    ],
};
