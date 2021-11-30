/* wwEditor:start */
import './components/SettingsEdit.vue';
import './components/SettingsSummary.vue';
import './components/CollectionEdit.vue';
import './components/CollectionSummary.vue';
import './components/RecordCreate.vue';
import './components/RecordDelete.vue';
import './components/RecordSync.vue';
import './components/RecordUpdate.vue';
import { GET_AIRTABLE_BASES, GET_AIRTABLE_TABLES } from './graphql';
/* wwEditor:end */

export default {
    /*=============================================m_ÔÔ_m=============================================\
        Collection API
    \================================================================================================*/
    /* wwEditor:start */
    // eslint-disable-next-line no-unused-vars
    async fetchCollection(_collection) {
        return { data: null, error: null };
    },
    /* wwEditor:end */
    /*=============================================m_ÔÔ_m=============================================\
        Airtable API
    \================================================================================================*/
    /* wwEditor:start */
    async getBases(isNoCache = false) {
        const response = await wwLib.$apollo.query({
            query: GET_AIRTABLE_BASES,
            variables: {
                apiKey: this.settings.privateData.apiKey,
            },
            fetchPolicy: isNoCache ? 'network-only' : 'cache-first',
        });
        return response.data.getAirtableBases.data;
    },
    async getTables(baseId, isNoCache = false) {
        const response = await wwLib.$apollo.query({
            query: GET_AIRTABLE_TABLES,
            variables: {
                apiKey: this.settings.privateData.apiKey,
                baseId,
            },
            fetchPolicy: isNoCache ? 'network-only' : 'cache-first',
        });
        return response.data.getAirtableTables.data;
    },
    /* wwEditor:end */
    async createRecord(cmsDataSetId, data) {
        try {
            const websiteId = wwLib.wwWebsiteData.getInfo().id;

            let response = null;
            /* wwEditor:start */
            response = await axios.post(
                `${wwLib.wwApiRequests._getPluginsUrl()}/designs/${websiteId}/cms_data_sets/${cmsDataSetId}/airtable/record`,
                { data },
                { headers: wwLib.wwApiRequests._getAuthHeader() }
            );
            /* wwEditor:end */
            /* wwFront:start */
            response = await axios.post(
                `//${websiteId}.${wwLib.wwApiRequests._getPreviewUrl()}/ww/cms_data_sets/${cmsDataSetId}/airtable/record`,
                { data }
            );
            /* wwFront:end */

            const record = response.data.data;
            const collection = wwLib.$store.getters['data/getCollections'][cmsDataSetId];
            wwLib.$store.dispatch('data/setCollection', {
                ...collection,
                total: collection.total + 1,
                data: [...collection.data, record],
            });

            return record;
        } catch (error) {
            wwLib.wwLog.error('Record not created : ', data);
            wwLib.wwLog.error(error);
        }
    },
    async updateRecord(cmsDataSetId, recordId, data) {
        try {
            const websiteId = wwLib.wwWebsiteData.getInfo().id;

            let response = null;
            /* wwEditor:start */
            response = await axios.patch(
                `${wwLib.wwApiRequests._getPluginsUrl()}/designs/${websiteId}/cms_data_sets/${cmsDataSetId}/airtable/record/${recordId}`,
                { data },
                { headers: wwLib.wwApiRequests._getAuthHeader() }
            );
            /* wwEditor:end */
            /* wwFront:start */
            response = await axios.patch(
                `//${websiteId}.${wwLib.wwApiRequests._getPreviewUrl()}/ww/cms_data_sets/${cmsDataSetId}/airtable/record/${recordId}`,
                { data }
            );
            /* wwFront:end */

            const record = response.data.data;
            const collection = _.cloneDeep(wwLib.$store.getters['data/getCollections'][cmsDataSetId]);
            if (!collection) return null;
            const recordIndex = collection.data.findIndex(item => item && item.id === recordId);
            collection.data.splice(recordIndex, 1, record);
            wwLib.$store.dispatch('data/setCollection', { ...collection, data: collection.data });

            return record;
        } catch (error) {
            wwLib.wwLog.error(`Record not updated : ${recordId}`, data);
            wwLib.wwLog.error(error);
        }
    },
    async deleteRecord(cmsDataSetId, recordId) {
        try {
            const websiteId = wwLib.wwWebsiteData.getInfo().id;

            let response = null;
            /* wwEditor:start */
            response = await axios.delete(
                `${wwLib.wwApiRequests._getPluginsUrl()}/designs/${websiteId}/cms_data_sets/${cmsDataSetId}/airtable/record/${recordId}`,
                { headers: wwLib.wwApiRequests._getAuthHeader() }
            );
            /* wwEditor:end */
            /* wwFront:start */
            response = await axios.delete(
                `//${websiteId}.${wwLib.wwApiRequests._getPreviewUrl()}/ww/cms_data_sets/${cmsDataSetId}/airtable/record/${recordId}`
            );
            /* wwFront:end */

            const record = response.data.data;
            const collection = _.cloneDeep(wwLib.$store.getters['data/getCollections'][cmsDataSetId]);
            if (!collection) return null;
            const recordIndex = collection.data.findIndex(item => item && item.id === recordId);
            collection.data.splice(recordIndex, 1);
            wwLib.$store.dispatch('data/setCollection', {
                ...collection,
                total: collection.total - 1,
                data: collection.data,
            });

            return record;
        } catch (error) {
            wwLib.wwLog.error(`Record not deleted : ${recordId}`);
            wwLib.wwLog.error(error);
        }
    },
    async syncRecord(cmsDataSetId, recordId) {
        try {
            const websiteId = wwLib.wwWebsiteData.getInfo().id;

            const response = await axios.get(
                `${wwLib.wwApiRequests._getPluginsUrl()}/hook/designs/${websiteId}/cms_data_sets/${cmsDataSetId}/sync/${recordId}/update`
            );
            const record = response.data.data;

            const collection = _.cloneDeep(wwLib.$store.getters['data/getCollections'][cmsDataSetId]);
            if (!collection) return null;
            const recordIndex = collection.data.findIndex(item => item && item.id === recordId);
            if (recordIndex === -1) {
                collection.data.push(record);
                wwLib.$store.dispatch('data/setCollection', {
                    ...collection,
                    total: collection.total + 1,
                    data: collection.data,
                });
            } else {
                collection.data.splice(recordIndex, 1, record);
                wwLib.$store.dispatch('data/setCollection', { ...collection, data: collection.data });
            }

            return record;
        } catch (error) {
            wwLib.wwLog.error(`Record not sync : ${recordId}`);
            wwLib.wwLog.error(error);
        }
    },
};
