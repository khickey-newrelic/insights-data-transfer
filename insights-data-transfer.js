// Reports on legacy alerts

const winston = require('winston');

var request = require('request');

// Synchronous read
var fs = require("fs");

var urllib = require('urllib-sync').request;

//******************************
//    Constants and Global Variables
//******************************
const INSIGHTS_QUERY_ENDPOINT = 'https://insights-api.newrelic.com/v1/accounts/';
const INSIGHTS_INSERT_ENDPOINT = 'https://insights-collector.newrelic.com/v1/accounts/';

sourceQueryApiKey = '';
sourceAccountId = '';
destinationInsertApiKey = '';
destinationAccountId = '';
query = '';
eventType = '';


//******************************
//    Configuration Values
//******************************

// Levels are error, info, verbose, debug, silly
// info is default value.  This can be overridden in the params files
winston.level = 'info';


//******************************
//    MAIN
//******************************

// Initializes configuration
loadConfig();

winston.info("sourceQueryApiKey = "+sourceQueryApiKey);
winston.info("sourceAccountId = "+sourceAccountId);
winston.info("destinationInsertApiKey = "+destinationInsertApiKey);
winston.info("destinationAccountId = "+destinationAccountId);
winston.info("query = "+query);

queryInsights();

//******************************
//    END MAIN
//******************************


//******************************
//    Main Functions
//******************************

// Synchronous call to query data from Insights
function queryInsights(){

	var endpoint = INSIGHTS_QUERY_ENDPOINT+sourceAccountId+'/query?nrql='+query;

    var queryOptions = {
	    headers: {
	        'X-Query-Key': sourceQueryApiKey
	    },
	    dataType: 'json'
	}


	var res = urllib(endpoint, queryOptions);
	if (res.err || res.status != 200) {
		throw new Error("Error insights data = "+res.err+", res.status = "+res.status);
	}
	else{
		winston.info("Insights data successfully returned");
		winston.info("Returned "+res.data.results[0].events.length+" events");
		var events = res.data.results[0].events;
		for (var i=0; i<events.length; i++){

			var event = events[i];
			event.eventType = eventType;
		}
		insertIntoInsights(events);
	}
}

// Asynchronous call inserts data into Insights
function insertIntoInsights(insertJson){

	var endpoint = INSIGHTS_INSERT_ENDPOINT+destinationAccountId+'/events';
	winston.info("Endpoint = "+endpoint);

	var insertOptions = {
    uri: endpoint,
    headers: { 'X-Insert-Key': destinationInsertApiKey },
    json: true,
    body: insertJson
  };
  //console.log(resultsArr['accountName']);

  request.post(insertOptions, function(error, res, body) {
     //console.log(response)
    if (!error && res.statusCode == 200) {
    	winston.info("Inserted successfully");
      
    } else {
    	winston.info(body);
      throw new Error("Error inserting data = "+res.statusCode);
    }
  });
}



// Reads config from params file and corresponding accounts file
function loadConfig(){
	var data = fs.readFileSync('params.js').toString().split('\n')

    for (var line in data) {

        var ln = data[line].split(':');

        if (ln[0] == 'LOG_LEVEL')
            {winston.level  = ln[1].replace(/ /g,"").replace(/\t/g,"").replace(/'/g,"")}

        if (ln[0] == 'SOURCE_ACCOUNT_ID')
            {sourceAccountId  = ln[1].replace(/ /g,"").replace(/\t/g,"").replace(/'/g,"")}

        if (ln[0] == 'DESTINATION_ACCOUNT_ID')
            {destinationAccountId  = ln[1].replace(/ /g,"").replace(/\t/g,"").replace(/'/g,"")}

        if (ln[0] == 'SOURCE_QUERY_API_KEY')
            {sourceQueryApiKey = ln[1].replace(/ /g,"").replace(/\t/g,"").replace(/'/g,"")}

        if (ln[0] == 'DESTINATION_INSERT_API_KEY')
            {destinationInsertApiKey = ln[1].replace(/ /g,"").replace(/\t/g,"").replace(/'/g,"")}

        if (ln[0] == 'QUERY')
            {query = ln[1].replace(/'/g,"")}

        if (ln[0] == 'EVENT_TYPE')
            {eventType  = ln[1].replace(/ /g,"").replace(/\t/g,"").replace(/'/g,"")}        

    }
}






