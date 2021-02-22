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
        if (!plugin.settings.privateData.apiKey) this.sidebarButton();
        /* wwEditor:end */
    },
    /* wwEditor:start */
    /*=============================================m_ÔÔ_m=============================================\
        META API
    \================================================================================================*/
    async getBases() {
        const { data } = await wwLib.$apollo.query({
            query: GET_AIRTABLE_BASES,
            variables: {
                apiKey: this.settings.privateData.apiKey,
            },
        });
        return data.getAirtableBases.data;
    },
    async getTables(baseId) {
        const { data } = await wwLib.$apollo.query({
            query: GET_AIRTABLE_TABLES,
            variables: {
                apiKey: this.settings.privateData.apiKey,
                baseId,
            },
        });
        return data.getAirtableTables.data;
    },
    /*=============================================m_ÔÔ_m=============================================\
        SIDEBAR POPUP
    \================================================================================================*/
    async sidebarButton() {
        try {
            const { id, settings } = wwLib.wwPlugins.pluginAirtable;
            await wwLib.wwPopups.open({
                firstPage: settings.privateData.apiKey ? 'AIRTABLE_POPUP' : 'AIRTABLE_CONFIGURATION_POPUP',
                data: {
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
