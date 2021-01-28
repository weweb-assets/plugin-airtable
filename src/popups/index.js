import settingsPopup from './settings.popup.vue';
import configurationPopup from './configuration.popup.vue';
import basesPopup from './bases.popup.vue';
import synchronizationPopup from './synchronization.popup.vue';

wwLib.wwPopups.addPopup('airtableSettingsPopup', settingsPopup);
wwLib.wwPopups.addPopup('airtableConfigurationPopup', configurationPopup);
wwLib.wwPopups.addPopup('airtableBasesPopup', basesPopup);
wwLib.wwPopups.addPopup('airtableSynchronizationPopup', synchronizationPopup);

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
    size: wwLib.wwPopups.SIZES.LARGE,
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

wwLib.wwPopups.addStory('AIRTABLE_SYNCHRONIZATION_POPUP', {
    title: {
        en: 'Airtable - Synchronization',
        fr: 'Airtable - Synchronization',
    },
    type: 'airtableSynchronizationPopup',
    size: wwLib.wwPopups.SIZES.MEDIUM,
});
