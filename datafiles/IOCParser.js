function InvalidIOCError(message) {
    this.name = 'InvalidIOCError';
    this.message = message;
}

function IOCParser(ioc) {
	this.ioc = new String(ioc);
	
	// Remove whitespace
	this.ioc = this.ioc.trim();

	// For any lists that use DNS-style FQDNs that end with a dot.
	if (this.ioc.charAt(this.ioc.length - 1) === '.') {
		this.ioc = this.ioc.slice(0, -1);
	}

	// Use all lower-case
	this.ioc = this.ioc.toLowerCase();

    // Most CTI list domains as foo[.]com to keep you from clicking on them.
    this.ioc = this.ioc.replace(new RegExp('\\[\\.\\]', 'g'), '.');

    // Remove "http://", "https://", "hxxp://" and "hxxps://"
    this.ioc = this.ioc.replace(new RegExp('^h[tx]{2}ps*://', 'g'), '');

    // Remove "/path/and/anything/else/here" and rely on regex being "greedy"
    this.ioc = this.ioc.replace(new RegExp('/.*$', 'g'), '');

    // If the IOC is an email address
    if (this.ioc.indexOf('@') !== -1) {
        this.ioc = this.ioc.replace(new RegExp('^.*@', 'g'), '');
    }

	// If it's an IP address
	var ip = this.ioc.split('.');
	if (ip.length === 4 && ip.every(function(part) { return !isNaN(part) && part >= 0 && part <= 255; })) {
		// If it's an IPv4 address
		this.ioc = ip.reverse().join('.') + '.in-addr.arpa';
	} else if (this.ioc.indexOf(':') !== -1) {
		// If it's an IPv6 address
		this.ioc = this.ioc.replace(/:/g, '');
		this.ioc = this.ioc.split('').reverse().join('') + '.ip6.arpa';
	} else {
		// If it's not a valid hostname either
		if (!/^([a-z0-9]([a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/.test(this.ioc)) {
			throw new InvalidIOCError('"' + this.ioc + '" is not a valid IP address or hostname');
		}
	}
}

IOCParser.prototype.toString = function() {
    return this.ioc;
}

IOCParser.prototype.valueOf = function() {
    return this.ioc;
}
