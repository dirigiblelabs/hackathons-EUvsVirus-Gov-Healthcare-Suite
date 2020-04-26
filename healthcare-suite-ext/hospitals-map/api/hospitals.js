var response = require("http/v4/response");
var query = require("db/v4/query");

var sql = "select * from HEALTHCARE_HOSPITALS";

var addresses = query.execute(sql).map(e => {
	return {
		name: e.NAME,
		longitude: e.LONGITUDE,
		latitude: e.LATITUDE
	};
});

response.println(JSON.stringify(addresses));