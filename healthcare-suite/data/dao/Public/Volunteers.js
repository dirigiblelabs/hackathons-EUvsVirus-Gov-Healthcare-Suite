var query = require("db/v4/query");
var producer = require("messaging/v4/producer");
var daoApi = require("db/v4/dao");
var EntityUtils = require("healthcare-suite/data/utils/EntityUtils");

var dao = daoApi.create({
	table: "HEALTHCARE_VOLUNTEERS",
	properties: [
		{
			name: "Id",
			column: "ID",
			type: "INTEGER",
			id: true,
		}, {
			name: "FirstName",
			column: "FIRSTNAME",
			type: "VARCHAR",
		}, {
			name: "LastName",
			column: "LASTNAME",
			type: "VARCHAR",
		}, {
			name: "Email",
			column: "EMAIL",
			type: "VARCHAR",
		}, {
			name: "Phone",
			column: "PHONE",
			type: "VARCHAR",
		}, {
			name: "ConfirmationStatus",
			column: "CONFIRMATIONSTATUS",
			type: "INTEGER",
		}, {
			name: "Assigned",
			column: "ASSIGNED",
			type: "BOOLEAN",
		}]
});

exports.list = function(settings) {
	return dao.list(settings).map(function(e) {
		EntityUtils.setBoolean(e, "Assigned");
		return e;
	});
};

exports.get = function(id) {
	var entity = dao.find(id);
	EntityUtils.setBoolean(entity, "Assigned");
	return entity;
};

exports.create = function(entity) {
	EntityUtils.setBoolean(entity, "Assigned");
	var id = dao.insert(entity);
	triggerEvent("Create", {
		table: "HEALTHCARE_VOLUNTEERS",
		key: {
			name: "Id",
			column: "ID",
			value: id
		}
	});
	return id;
};

exports.update = function(entity) {
	EntityUtils.setBoolean(entity, "Assigned");
	dao.update(entity);
	triggerEvent("Update", {
		table: "HEALTHCARE_VOLUNTEERS",
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
		table: "HEALTHCARE_VOLUNTEERS",
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
	var resultSet = query.execute("SELECT COUNT(*) AS COUNT FROM HEALTHCARE_VOLUNTEERS");
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
	producer.queue("healthcare-suite/Public/Volunteers/" + operation).send(JSON.stringify(data));
}