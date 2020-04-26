var query = require("db/v4/query");
var producer = require("messaging/v4/producer");
var daoApi = require("db/v4/dao");

var dao = daoApi.create({
	table: "HEALTHCARE_REPORT_MEDICAL_EQUIPMENT",
	properties: [
		{
			name: "Name",
			column: "NAME",
			type: "VARCHAR",
			id: true,
		}, {
			name: "Quantity",
			column: "QUANTITY",
			type: "INTEGER",
		}, {
			name: "AvailableQuantity",
			column: "AVAILABLEQUANTITY",
			type: "INTEGER",
		}]
});

exports.list = function(settings) {
	return dao.list(settings);
};

exports.count = function() {
	return dao.count();
};

exports.customDataCount = function() {
	var resultSet = query.execute("SELECT SUM(QUANTITY) AS COUNT FROM HEALTHCARE_MEDICAL_EQUIPMENT");
	if (resultSet !== null && resultSet[0] !== null) {
		if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
			return resultSet[0].COUNT;
		} else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
			return resultSet[0].count;
		}
	}
	return 0;
};

function triggerEvent(operation, data) {
	producer.queue("healthcare-suite/Statistics/ReportMedicalEquipment/" + operation).send(JSON.stringify(data));
}