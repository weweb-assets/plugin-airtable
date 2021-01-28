const Airtable = require('airtable');

let recordsCache = {};

export default {
    configure(apiKey) {
        Airtable.configure({
            endpointUrl: 'https://api.airtable.com',
            apiKey,
        });
    },
    getBase(app) {
        return Airtable.base(app);
    },
    async getLinkRecords(base, table, fields, depth = 0) {
        if (depth > 2) return;
        for (const [key, value] of Object.entries(fields)) {
            if (typeof value === 'object' && Array.isArray(value)) {
                for (const valueKey in value) {
                    if (typeof value[valueKey] === 'string' && value[valueKey].indexOf('rec') !== -1) {
                        const recordId = value[valueKey];
                        fields[key][valueKey] =
                            _.cloneDeep(recordsCache[recordId]) || (await base(table).find(recordId)).fields;
                        recordsCache[recordId] = fields[key][valueKey];
                    }
                    if (typeof fields[key][valueKey] === 'object')
                        await this.getLinkRecords(base, table, fields[key][valueKey], ++depth);
                }
            }
        }
    },
    async getTable(base, table, options) {
        recordsCache = {};
        const records = await base(table).select(options).all();
        const fields = records.map(record => record.fields);
        for (const field of fields) await this.getLinkRecords(base, table, field);
        return fields;
    },
};
