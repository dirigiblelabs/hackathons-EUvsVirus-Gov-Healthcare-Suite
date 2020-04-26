var query = require("db/v4/query");
var producer = require("messaging/v4/producer");
var daoApi = require("db/v4/dao");
var EntityUtils = require("healthcare-suite/data/utils/EntityUtils");

var dao = daoApi.create({
	table: "HEALTHCARE_CONDITION_HISTORY",
	properties: [
		{
			name: "Id",
			column: "ID",
			type: "INTEGER",
			id: true,
		}, {
			name: "Patient",
			column: "PATIENT",
			type: "INTEGER",
		}, {
			name: "Date",
			column: "DATE",
			type: "DATE",
		}, {
			name: "Condition",
			column: "CONDITION",
			type: "INTEGER",
		}, {
			name: "Comment",
			column: "COMMENT",
			type: "VARCHAR",
		}]
});

exports.list = function(settings) {
	return dao.list(settings).map(function(e) {
		EntityUtils.setLocalDate(e, "Date");
		return e;
	});
};

exports.get = function(id) {
	var entity = dao.find(id);
	EntityUtils.setLocalDate(entity, "Date");
	return entity;
};

exports.create = function(entity) {
	EntityUtils.setLocalDate(entity, "Date");
	var id = dao.insert(entity);
	triggerEvent("Create", {
		table: "HEALTHCARE_CONDITION_HISTORY",
		key: {
			name: "Id",
			column: "ID",
			value: id
		}
	});
	return id;
};

exports.update = function(entity) {
	EntityUtils.setLocalDate(entity, "Date");
	dao.update(entity);
	triggerEvent("Update", {
		table: "HEALTHCARE_CONDITION_HISTORY",
		key: {
			name: "Id",
			column: "ID",
			value: entity.Id
		}
	});
};

exports.delete = function(id) {
	dao.remove(id);
	triggerEvent("Delete", {
		table: "HEALTHCARE_CONDITION_HISTORY",
		key: {
			name: "Id",
			column: "ID",
			value: id
		}
	});
};

exports.count = function() {
	return dao.count();
};

exports.customDataCount = function() {
	var resultSet = query.execute("SELECT COUNT(*) AS COUNT FROM HEALTHCARE_CONDITION_HISTORY");
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
	producer.queue("healthcare-suite/Hospitals/ConditionHistory/" + operation).send(JSON.stringify(data));
}