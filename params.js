// Values for insights-data-transfer.js

// Levels are error, info, verbose, debug, silly
LOG_LEVEL: 'info'

// Source account - where to extract the data from
SOURCE_QUERY_API_KEY: 'AAAAAAAAA'
SOURCE_ACCOUNT_ID: '000000'

// Insights insert key - destination account 
DESTINATION_INSERT_API_KEY: 'AAAAAAAAA'
DESTINATION_ACCOUNT_ID: '000000'

// Insights query
QUERY: 'select * from Transaction since 30 minutes ago limit 1000'

// Event name
EVENT_TYPE: 'TestEvent'