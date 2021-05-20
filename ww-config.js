module.exports = {
    componentPath: './src/index.js',
    editor: {
        settings: {
            edit: () => import('./src/SettingsEdit.vue'),
            summary: () => import('./src/SettingsSummary.vue'),
        },
        collection: {
            edit: () => import('./src/CollectionEdit.vue'),
            // summary: () => '',
        },
    },
};
