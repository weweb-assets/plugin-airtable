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
            aiDescription: {
                description: 'Create a record in the selected collection.',
                return: 'null',
                syntax: `{
                    "args": {
                        "collectionId": "{{id of the collection as string}}",
                        "data": {
                            "fieldName": {{value as string, number or ACTION_VALUE}},
                            ...other fields to update
                        }
                    }                    
                }`,
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
            aiDescription: {
                description: 'Update a record in the selected collection.',
                return: 'null',
                syntax: `{
                    "args": {
                        "collectionId": "{{id of the collection as string}}",
                        "recordId": "{{id of the record to update as string or ACTION_VALUE}}",
                        "fields": ["fieldName1", "fieldName2", ...],
                        "data": {
                            "fieldName": {{value as string, number or ACTION_VALUE}},
                            ...other fields to update
                        }
                    }                    
                }`,
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
            aiDescription: {
                description: 'Delete a record in the selected collection.',
                return: 'null',
                syntax: `{
                    "args": {
                        "collectionId": "{{id of the collection as string}}",
                        "recordId": "{{id of the record to delete as string or ACTION_VALUE}}",
                    }                    
                }`,
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
            aiDescription: {
                description: 'Refresh the cache of a record if a collection is of type "cached".',
                return: 'null',
                syntax: `{
                    "args": {
                        "collectionId": "{{id of the collection as string}}",
                        "recordId": "{{id of the record to sync as string or ACTION_VALUE}}",
                    }                    
                }`,
            },
            /* wwEditor:end */
        },
    ],
};
