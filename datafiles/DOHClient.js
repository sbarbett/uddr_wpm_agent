function DOHClient(ioc, clientID) {
	this.ioc = new String(ioc);
	this.resolver = "https://rcsv.ddr.ultradns.com"
	this.clientID = clientID
	
	var c = openHttpClient();
	var g = c.newGet(this.resolver + "/" + this.clientID + "?name=" + this.ioc)
	g.addRequestHeader("Accept", "application/dns+json")
	var r = g.execute();
	
	this.resp = r.getBody();
}

DOHClient.prototype.response = function() {
	return this.resp;
}
