export function convertCondition({ field, operator, value, isEmptyIgnored }) {
    if (isEmptyIgnored && wwLib.wwUtils.isEmpty(value)) return null;
    switch (operator) {
        case '$eq':
            return `{${field}} = ${value}`;
        case '$ne':
            return `{${field}} != ${value}`;
        case '$lt':
            return `{${field}} < ${value}`;
        case '$gt':
            return `{${field}} > ${value}`;
        case '$lte':
            return `{${field}} <= ${value}`;
        case '$gte':
            return `{${field}} >= ${value}`;
        case '$iLike:contains':
            return `FIND(${field},${value})`;
        case '$notILike:contains':
            return `NOT(FIND(${field},${value}))`;
        case '$iLike:startsWith':
            return `FIND(LEFT(${field}, ${value.length}),${value}))`;
        case '$iLike:endsWith':
            return `FIND(RIGHT(${field}, ${value.length}),${value}))`;
        case '$eq:null':
            return `IF({${field}}, TRUE(), FALSE())`;
        case '$ne:null':
            return `IF({${field}}, FALSE(), TRUE())`;
        case '$in':
            return '';
        case '$notIn':
            return '';
        case '$overlap':
            return '';
        case '$notOverlap':
            return '';
        case '$contains':
            return '';
        case '$has':
            return '';
        case '$hasNot':
            return '';
        case '$match':
            return '';
        case '$notMatch':
            return '';
        default:
            break;
    }
}

export function generateFilter(config) {
    if (!config) return '';
    if (!config.link || !config.conditions || config.if === false) return '';
    const conditions = config.conditions
        .map(condition => {
            return condition.link ? generateFilter(condition) : convertCondition(condition);
        })
        .filter(condition => condition);

    if (!conditions.length) return '';

    const filter = `${config.link.slice(1)}(${conditions.join()})`;

    return filter;
}
