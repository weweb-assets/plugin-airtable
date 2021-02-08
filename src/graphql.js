import gql from 'graphql-tag';

export const GET_AIRTABLE_BASES = gql`
    query GetAirtableBases($apiKey: String!) {
        getAirtableBases(apiKey: $apiKey) {
            success
            data
        }
    }
`;

export const GET_AIRTABLE_TABLES = gql`
    query GetAirtableTables($apiKey: String!, $baseId: String!) {
        getAirtableTables(apiKey: $apiKey, baseId: $baseId) {
            success
            data
        }
    }
`;
