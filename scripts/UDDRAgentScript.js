eval(datafile("IOCParser.js").readContents()+"");
eval(datafile("DOHClient.js").readContents()+"");
var threatFeeds = JSON.parse(datafile("threatFeeds.json").readContents());
var credentials = getCSV("credentials.csv");
var c = openHttpClient();

beginTransaction(function(tx) {
	var feed;
	var parsed = [];
	
	beginStep("Download the OpenPhish feed", function(s) {
		s.setStepTimeout(10000);
		log("Downloading feed...\n===================================\n")
		var n = threatFeeds['feeds'][0]['name'];
		var u = threatFeeds['feeds'][0]['url'];
		log("Using feed '" + n + "' @ " + u);
		var g = c.get(u);
		var t = g.getBody();
		feed = t.split("\n");
		log("\n");
	});
	
	beginStep("Iterate through feed and parse IoCs", function(s) {
		s.setStepTimeout(10000);
		log("Parsing feed...\n===================================\n")
		for(var i = 0; i < feed.length; i++) {
			try {
				var p = new IOCParser(feed[i]);
				p = p.toString();
				if (parsed.indexOf(p) === -1) {
					parsed.push(p);
					log("Added: Line " + i + ": " + p);
				} else {
					log("Duplicate: Line " + i + ": " + p);
				}
			} catch (e) {
				log("Error: Line " + i + ": " + e);
			}
		}
		log("\n");
	});
	
	beginStep("Query non-duplicate IoCs against UDDR", function(s) {
		s.setStepTimeout(120000);
		log("Querying IoCs...\n===================================\n")
		var r = credentials.get(0);
		var cn = r.get('name');
		var cid = r.get('clientID');
		log("Querying the '" + cn + "' resolver using ID " + cid);
		for(var i = 0; i < parsed.length; i++) {
			try {
				var r = new DOHClient(parsed[i], cid);
				r = r.response();
				log("Data for " + parsed[i] + ": " + r);
			} catch (e) {
				log("Error querying " + parsed[i] + ": " + e);
			}
		}
		log("\n");
	});
	
});
