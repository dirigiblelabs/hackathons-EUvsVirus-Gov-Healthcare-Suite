var rs = require("http/v4/rs");
var dao = require("healthcare-suite/data/dao/Statistics/ReportMedicalEquipment");
var http = require("healthcare-suite/api/http");

rs.service()
	.resource("")
		.get(function(ctx, request) {
			var queryOptions = {};
			var parameters = request.getParameterNames();
			for (var i = 0; i < parameters.length; i ++) {
				queryOptions[parameters[i]] = request.getParameter(parameters[i]);
			}
			var entities = dao.list(queryOptions);
			http.sendResponseOk(entities);
		})
.execute();
