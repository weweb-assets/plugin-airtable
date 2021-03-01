/* wwEditor:start */
import './popups';
import { GET_AIRTABLE_BASES, GET_AIRTABLE_TABLES } from './graphql';
/* wwEditor:end */

export default {
    /* wwEditor:start */
    /*=============================================m_ÔÔ_m=============================================\
        Data
    \================================================================================================*/
    settings: {
        data: {},
        privateData: {
            apiKey: '',
            tables: [],
        },
    },
    /* wwEditor:end */
    /*=============================================m_ÔÔ_m=============================================\
        Init
    \================================================================================================*/
    async init() {
        /* wwEditor:start */
        const plugin = wwLib.wwPlugins.pluginAirtable;
        plugin.settings = (await wwLib.wwPlugin.getSettings(plugin.id)) || this.settings;
        if (!plugin.settings.privateData.apiKey) plugin.settings.privateData.apiKey = '';
        if (!plugin.settings.privateData.tables) plugin.settings.privateData.tables = [];
        if (plugin.isNew && !plugin.settings.privateData.apiKey.length) {
            this.sidebarButton();
        }
        /* wwEditor:end */
    },
    /* wwEditor:start */
    /*=============================================m_ÔÔ_m=============================================\
        META API
    \================================================================================================*/
    async getBases(isNoCache = false) {
        const { data } = await wwLib.$apollo.query({
            query: GET_AIRTABLE_BASES,
            variables: {
                apiKey: this.settings.privateData.apiKey,
            },
            fetchPolicy: isNoCache ? 'network-only' : 'cache-first',
        });
        return data.getAirtableBases.data;
    },
    async getTables(baseId, isNoCache = false) {
        const { data } = await wwLib.$apollo.query({
            query: GET_AIRTABLE_TABLES,
            variables: {
                apiKey: this.settings.privateData.apiKey,
                baseId,
            },
            fetchPolicy: isNoCache ? 'network-only' : 'cache-first',
        });
        return data.getAirtableTables.data;
    },
    /*=============================================m_ÔÔ_m=============================================\
        SIDEBAR POPUP
    \================================================================================================*/
    async sidebarButton() {
        try {
            const { id, settings } = wwLib.wwPlugins.pluginAirtable;
            const isSetup = !!settings.privateData.apiKey.length;
            const isFirstTime = !settings.privateData.tables.length;
            await wwLib.wwPopups.open({
                firstPage: isSetup ? 'AIRTABLE_POPUP' : 'AIRTABLE_CONFIGURATION_POPUP',
                data: {
                    isFirstTime,
                    pluginId: id,
                    settings,
                },
            });
        } catch (err) {
            wwLib.wwLog.error(err);
        }
    },
    /* wwEditor:end */
};
