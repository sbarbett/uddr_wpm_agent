#!/bin/bash

# Make sure key and secret are passed as args
if [ $# -ne 2 ]; then
    printf "You must provide the API key and secret as arguments.\n"
    exit 1
fi


# Check if credentials.csv file exists
if [ ! -f ./datafiles/credentials.csv ]; then
  printf "ERROR: File 'credentials.csv' not found.\n"
  printf "Please configure your credentials file and try again.\n"
  exit 1
fi

apikey=$1
secret=$2
timestamp=$(date +%s)  # equivalent of PHP's gmdate('U')
sig=$(echo -n "${apikey}${secret}${timestamp}" | md5sum | cut -d" " -f1)

printf "Signature: $sig \n\n"

# Upload datafiles

# Build the params
cred_url="https://script.ultrawpm.com/api/1.0/file?apikey=$apikey&sig=$sig&qqfile=credentials.csv"
# Send multipart POST request
printf "Uploading credentials.csv to data files...\n"
echo $cred_url
printf "\n"
curl -X POST -H "Content-Type: multipart/form-data" -F "file=@./datafiles/credentials.csv" $cred_url
printf "\n\n"

# DOHClient.js
doh_url="https://script.ultrawpm.com/api/1.0/file?apikey=$apikey&sig=$sig&qqfile=DOHClient.js"
printf "Uploading DOHClient.js to data files...\n"
echo $doh_url
printf "\n"
curl -X POST -H "Content-Type: multipart/form-data" -F "file=@./datafiles/DOHClient.js" $doh_url
printf "\n\n"

# IOCParser.js
ioc_url="https://script.ultrawpm.com/api/1.0/file?apikey=$apikey&sig=$sig&qqfile=IOCParser.js"
printf "Uploading IOCParser.js to data files...\n"
echo $ioc_url
printf "\n"
curl -X POST -H "Content-Type: multipart/form-data" -F "file=@./datafiles/IOCParser.js" $ioc_url
printf "\n\n"

# threatFeeds.json
feeds_url="https://script.ultrawpm.com/api/1.0/file?apikey=$apikey&sig=$sig&qqfile=threatFeeds.json"
printf "Uploading threatFeeds.json to data files...\n"
echo $feeds_url
printf "\n"
curl -X POST -H "Content-Type: multipart/form-data" -F "file=@./datafiles/threatFeeds.json" $feeds_url
printf "\n\n"

script_url="https://wpm-api.security.biz/performance/script/1.0/upload/body?apikey=$apikey&sig=$sig"

# Upload the test script file
printf "Uploading UDDRAgentScript.js to scripts...\n"
echo $script_url
printf "\n"
curl -X POST -H "Content-Type: application/json" --data @./scripts/payload.json $script_url
printf "\n"
