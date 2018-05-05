# insights-data-transfer
Simple script that queries data from Insights in one account and inserts the results into another account.

The purpose of this script is to demonstrate a very simple example of transferring event data from one account to another.  Typical extensions may be: 
- Query from multiple accounts 
- Add custom parameters to the json before importing (Add this where eventType is added)
- Change to run on a batch - to note latest timestamp each time it's run and pick up events since that timestamp the next time it's run
