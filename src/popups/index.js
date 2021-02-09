import settingsPopup from './settings.popup.vue';
import configurationPopup from './configuration.popup.vue';
import tablesPopup from './tables.popup.vue';
import tablePopup from './table.popup.vue';
import synchronizationPopup from './synchronization.popup.vue';
import automationsPopup from './automations.popup.vue';

wwLib.wwPopups.addPopup('airtableSettingsPopup', settingsPopup);
wwLib.wwPopups.addPopup('airtableConfigurationPopup', configurationPopup);
wwLib.wwPopups.addPopup('airtableTablesPopup', tablesPopup);
wwLib.wwPopups.addPopup('airtableTablePopup', tablePopup);
wwLib.wwPopups.addPopup('airtableSynchronizationPopup', synchronizationPopup);
wwLib.wwPopups.addPopup('airtableAutomationsPopup', automationsPopup);

wwLib.wwPopups.addStory('AIRTABLE_POPUP', {
    title: {
        en: 'Airtable',
        fr: 'Airtable',
    },
    type: 'airtableSettingsPopup',
    size: wwLib.wwPopups.SIZES.MEDIUM,
});

wwLib.wwPopups.addStory('AIRTABLE_CONFIGURATION_POPUP', {
    title: {
        en: 'Airtable - Configuration',
        fr: 'Airtable - Configuration',
    },
    type: 'airtableConfigurationPopup',
    size: wwLib.wwPopups.SIZES.MEDIUM,
    buttons: {
        SAVE: {
            text: {
                en: 'Save configuration',
                fr: 'Enregistrer la configuration',
            },
            next: 'AIRTABLE_TABLES_POPUP',
        },
    },
});

wwLib.wwPopups.addStory('AIRTABLE_TABLES_POPUP', {
    title: {
        en: 'Airtable - Tables',
        fr: 'Airtable - Tables',
    },
    type: 'airtableTablesPopup',
    size: wwLib.wwPopups.SIZES.MEDIUM,
    buttons: {
        SAVE: {
            text: {
                en: 'Save tables',
                fr: 'Enregistrer les tables',
            },
            next: 'AIRTABLE_SYNCHRONIZATION_POPUP',
        },
    },
});

wwLib.wwPopups.addStory('AIRTABLE_ADD_TABLE_POPUP', {
    title: {
        en: 'Airtable - Add table',
        fr: 'Airtable - Ajouter une table',
    },
    type: 'airtableTablePopup',
    size: wwLib.wwPopups.SIZES.MEDIUM,
    buttons: {
        SAVE: {
            text: {
                en: 'Add table',
                fr: 'Ajouter une table',
            },
        },
    },
});

wwLib.wwPopups.addStory('AIRTABLE_EDIT_TABLE_POPUP', {
    title: {
        en: 'Airtable - Edit table',
        fr: 'Airtable - Editer la table',
    },
    type: 'airtableTablePopup',
    size: wwLib.wwPopups.SIZES.MEDIUM,
    buttons: {
        SAVE: {
            text: {
                en: 'Edit table',
                fr: 'Editer la table',
            },
        },
    },
});

wwLib.wwPopups.addStory('AIRTABLE_AUTOMATIONS_POPUP', {
    title: {
        en: 'Airtable - Automations',
        fr: 'Airtable - Automations',
    },
    type: 'airtableAutomationsPopup',
    size: wwLib.wwPopups.SIZES.MEDIUM,
    buttons: {
        DONE: {
            text: {
                en: 'Done',
                fr: 'Done',
            },
        },
    },
});

wwLib.wwPopups.addStory('AIRTABLE_SYNCHRONIZATION_POPUP', {
    title: {
        en: 'Airtable - Synchronization',
        fr: 'Airtable - Synchronization',
    },
    type: 'airtableSynchronizationPopup',
    size: wwLib.wwPopups.SIZES.MEDIUM,
    buttons: {
        DONE: {
            text: {
                en: 'Done',
                fr: 'Done',
            },
        },
    },
});
