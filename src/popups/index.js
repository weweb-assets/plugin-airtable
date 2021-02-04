import settingsPopup from './settings.popup.vue';
import configurationPopup from './configuration.popup.vue';
import basesPopup from './bases.popup.vue';
import basePopup from './base.popup.vue';
import tablePopup from './table.popup.vue';
import synchronizationPopup from './synchronization.popup.vue';
import automationsPopup from './automations.popup.vue';

wwLib.wwPopups.addPopup('airtableSettingsPopup', settingsPopup);
wwLib.wwPopups.addPopup('airtableConfigurationPopup', configurationPopup);
wwLib.wwPopups.addPopup('airtableBasesPopup', basesPopup);
wwLib.wwPopups.addPopup('airtableBasePopup', basePopup);
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
            next: 'AIRTABLE_BASES_POPUP',
        },
    },
});

wwLib.wwPopups.addStory('AIRTABLE_BASES_POPUP', {
    title: {
        en: 'Airtable - Bases',
        fr: 'Airtable - Bases',
    },
    type: 'airtableBasesPopup',
    size: wwLib.wwPopups.SIZES.MEDIUM,
    buttons: {
        SAVE: {
            text: {
                en: 'Save bases',
                fr: 'Enregistrer les bases',
            },
            next: 'AIRTABLE_SYNCHRONIZATION_POPUP',
        },
    },
});

wwLib.wwPopups.addStory('AIRTABLE_ADD_BASE_POPUP', {
    title: {
        en: 'Airtable - Add base',
        fr: 'Airtable - Ajouter une base',
    },
    type: 'airtableBasePopup',
    size: wwLib.wwPopups.SIZES.MEDIUM,
    buttons: {
        SAVE: {
            text: {
                en: 'Add base',
                fr: 'Ajouter une base',
            },
        },
    },
});

wwLib.wwPopups.addStory('AIRTABLE_EDIT_BASE_POPUP', {
    title: {
        en: 'Airtable - Edit base',
        fr: 'Airtable - Editer une base',
    },
    type: 'airtableBasePopup',
    size: wwLib.wwPopups.SIZES.MEDIUM,
    buttons: {
        SAVE: {
            text: {
                en: 'Edit base',
                fr: 'Editer la base',
            },
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
});

wwLib.wwPopups.addStory('AIRTABLE_SYNCHRONIZATION_POPUP', {
    title: {
        en: 'Airtable - Synchronization',
        fr: 'Airtable - Synchronization',
    },
    type: 'airtableSynchronizationPopup',
    size: wwLib.wwPopups.SIZES.MEDIUM,
});
