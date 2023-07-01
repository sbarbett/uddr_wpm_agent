uddr_wpm_agent
======================

This repository contains scripts for integrating Vercara's [UltraWPM](https://home.ultrawpm.com/) agent network and various threat intelligence feeds with [UltraDDR](https://ddr.ultradns.com). The aim is to routinely seed UDDR's resolvers with Indicators of Compromise (IoCs). When encountering new domains, UltraDDR will flag them and, through the Watch Engine's synthesis process, evaluate them for potential blocking. These scripts help to automate and distribute this process and give users the latitude to incorporate their own feeds.

## Components

The scripts are modularized to enhance their extensibility.

### Data Files

These files are evaluated and used by the test script.

* `DOHClient.js`: Contains a short function for building and submitting DoH requests to the resolver. It takes 2 positional args, the IoC and client ID.
* `IOCParser.js`: A parser for IoCs. It will attempt to extrapolate DNS parts or IPs from URLs and emails, which are most commonly what threat feeds report.
* `threatFeeds.json`: A JSON object that contains an array of feeds. Each feed has a "name" and "url".
* `credentials.csv`: A CSV containing two columns for account names and their associated client IDs. An example file is given.

### Script(s)

A default test script is provided.

* `UDDRAgentScript.js`: This script will retrieve the first feed of _threatFeeds.json_ and use the first row of credentials from _credentials.csv_ to iterate and query its list of IoCs. Details are recorded in the log buffer.
* `payload.json`: This is so the setup can create the script in WPM using its REST API.

## Setup

I've included a shell script that will upload the repository components to WPM using your REST apikey and secret. First, edit _credentials.csv.json.example_, add your org name and client ID then save it as _datafiles/credentials.csv_. Once you've updated the credentials, run the following.

```bash
./setup.sh <your WPM API key> <secret>
```

They can also be imported through the UI by navigating to Monitoring -> Scripts.

### Creating a Monitor

Click on the _Monitoring_ tab then _Create Monitor_. Couple things to note:

1. The script uses HttpClient to produce HTTP requests, not Selenium, so there is no browser involved. Browserless scripts consume 1 unit per step per transaction (as opposed to 4).
2. When selecting an interval, keep in mind that it should be divided by the number of locations selected. A 30 min interval with 3 locations will run every 10 min. It iterates through every location in that span of time.
3. If you uploaded the default test script using the setup file, it will be named _UltraDDR ThreatFeed Agent_.

## About the EMCAScript Version

WPM has an older implementation of Rhino with an out-of-date version of EMCAScript, hence the use of object prototypes. Classes were introduced in ES6. Keep this in mind if you decide to write your own custom scenarios.

## Alternatives

If you don't have a WPM account and would like to host a similar routine on, for example, Lambda, I'd suggest checking out my [Python client for UDDR](https://github.com/sbarbett/uddr_client) and [this script](https://github.com/sbarbett/ioc_checker). Michael Smith's [ultraddr-ioc-checker](https://github.com/rybolov/UltraDDR-IOC-Checker) was the inspiration for these projects.

## License

This project is licensed under the terms of the MIT license. See LICENSE.md for more details.
