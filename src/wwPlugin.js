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
    async createRecord({ collectionId, data }, wwUtils) {
        const websiteId = wwLib.wwWebsiteData.getInfo().id;

        let response = null;
        /* wwEditor:start */
        wwUtils && wwUtils.log({ label: 'Payload', preview: data });
        /* wwEditor:end */
        /* wwEditor:start */
        response = await axios.post(
            `${wwLib.wwApiRequests._getPluginsUrl()}/designs/${websiteId}/cms_data_sets/${collectionId}/airtable/record`,
            { data },
            { headers: wwLib.wwApiRequests._getAuthHeader() }
        );
        /* wwEditor:end */
        /* wwFront:start */
        response = await axios.post(
            `//${websiteId}.${wwLib.wwApiRequests._getPreviewUrl()}/ww/cms_data_sets/${collectionId}/airtable/record`,
            { data }
        );
        /* wwFront:end */

        const record = response.data.data;
        const collection = wwLib.$store.getters['data/getCollections'][collectionId];
        if (!collection) return null;
        const collectionData = collection.data || []
        wwLib.$store.dispatch('data/setCollection', {
            ...collection,
            total: collection.total + 1,
            data: [...collectionData, record],
        });

        return record;
    },
    async updateRecord({ collectionId, recordId, data }, wwUtils) {
        const websiteId = wwLib.wwWebsiteData.getInfo().id;

        let response = null;
        /* wwEditor:start */
        wwUtils && wwUtils.log({ label: 'Record ID', preview: recordId });
        wwUtils && wwUtils.log({ label: 'Payload', preview: data });
        /* wwEditor:end */
        /* wwEditor:start */
        response = await axios.patch(
            `${wwLib.wwApiRequests._getPluginsUrl()}/designs/${websiteId}/cms_data_sets/${collectionId}/airtable/record/${recordId}`,
            { data },
            { headers: wwLib.wwApiRequests._getAuthHeader() }
        );
        /* wwEditor:end */
        /* wwFront:start */
        response = await axios.patch(
            `//${websiteId}.${wwLib.wwApiRequests._getPreviewUrl()}/ww/cms_data_sets/${collectionId}/airtable/record/${recordId}`,
            { data }
        );
        /* wwFront:end */

        const record = response.data.data;
        const collection = _.cloneDeep(wwLib.$store.getters['data/getCollections'][collectionId]);
        if (!collection) return null;
        const collectionData = collection.data || []
        const recordIndex = collectionData.findIndex(item => item && item.id === recordId);
        collectionData.splice(recordIndex, 1, record);
        wwLib.$store.dispatch('data/setCollection', { ...collection, data: collectionData });

        return record;
    },
    async deleteRecord({ collectionId, recordId }, wwUtils) {
        const websiteId = wwLib.wwWebsiteData.getInfo().id;

        let response = null;
        /* wwEditor:start */
        wwUtils && wwUtils.log({ label: 'Record ID', preview: recordId });
        /* wwEditor:end */
        /* wwEditor:start */
        response = await axios.delete(
            `${wwLib.wwApiRequests._getPluginsUrl()}/designs/${websiteId}/cms_data_sets/${collectionId}/airtable/record/${recordId}`,
            { headers: wwLib.wwApiRequests._getAuthHeader() }
        );
        /* wwEditor:end */
        /* wwFront:start */
        response = await axios.delete(
            `//${websiteId}.${wwLib.wwApiRequests._getPreviewUrl()}/ww/cms_data_sets/${collectionId}/airtable/record/${recordId}`
        );
        /* wwFront:end */

        const record = response.data.data;
        const collection = _.cloneDeep(wwLib.$store.getters['data/getCollections'][collectionId]);
        if (!collection) return null;
        const collectionData = collection.data || []
        const recordIndex = collectionData.findIndex(item => item && item.id === recordId);
        collectionData.splice(recordIndex, 1);
        wwLib.$store.dispatch('data/setCollection', {
            ...collection,
            total: collection.total - 1,
            data: collectionData,
        });

        return record;
    },
    async syncRecord({ collectionId, recordId }, wwUtils) {
        const websiteId = wwLib.wwWebsiteData.getInfo().id;

        /* wwEditor:start */
        wwUtils && wwUtils.log({ label: 'Record ID', preview: recordId });
        /* wwEditor:end */
        const response = await axios.get(
            `${wwLib.wwApiRequests._getPluginsUrl()}/hook/designs/${websiteId}/cms_data_sets/${collectionId}/sync/${recordId}/update`
        );
        const record = response.data.data;

        const collection = _.cloneDeep(wwLib.$store.getters['data/getCollections'][collectionId]);
        if (!collection) return null;
        const collectionData = collection.data || []
        const recordIndex = collectionData.findIndex(item => item && item.id === recordId);
        if (recordIndex === -1) {
            collectionData.push(record);
            wwLib.$store.dispatch('data/setCollection', {
                ...collection,
                total: collection.total + 1,
                data: collectionData,
            });
        } else {
            collectionData.splice(recordIndex, 1, record);
            wwLib.$store.dispatch('data/setCollection', { ...collection, data: collectionData });
        }

        return record;
    },
};
