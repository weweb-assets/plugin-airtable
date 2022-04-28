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
