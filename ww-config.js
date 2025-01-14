export default {
    features: {
        datasource: true,
    },
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
            copilot: {
                description: "Creates a new record in an Airtable collection",
                returns: "object - The newly created record",
                schema: {
                    collectionId: {
                        type: "string",
                        description: "ID of the Airtable collection",
                        bindable: false
                    },
                    data: {
                        type: "object",
                        description: "Data object containing field values for the new record",
                        bindable: true
                    }
                }
            }
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
            copilot: {
                description: "Updates an existing record in an Airtable collection",
                returns: "object - The updated record",
                schema: {
                    collectionId: {
                        type: "string", 
                        description: "ID of the Airtable collection",
                        bindable: false
                    },
                    recordId: {
                        type: "string",
                        description: "ID of the record to update",
                        bindable: true
                    },
                    data: {
                        type: "object",
                        description: "Data object containing updated field values",
                        bindable: true
                    }
                }
            }
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
            copilot: {
                description: "Deletes a record from an Airtable collection",
                returns: "object - The deleted record",
                schema: {
                    collectionId: {
                        type: "string",
                        description: "ID of the Airtable collection",
                        bindable: false
                    },
                    recordId: {
                        type: "string",
                        description: "ID of the record to delete",
                        bindable: true
                    }
                }
            }
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
            copilot: {
                description: "Synchronizes a record with Airtable to get its latest data",
                returns: "object - The synchronized record with updated data",
                schema: {
                    collectionId: {
                        type: "string",
                        description: "ID of the Airtable collection",
                        bindable: false
                    },
                    recordId: {
                        type: "string",
                        description: "ID of the record to synchronize",
                        bindable: true
                    }
                }
            }
            /* wwEditor:end */
        },
    ],
};