/*
 * Copyright (c) 2010-2020 SAP and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v2.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v20.html
 * Contributors:
 * SAP - initial API and implementation
 */

var dao = require("healthcare-suite/data/dao/Public/Volunteers.js")

exports.getTile = function(relativePath) {
	return {
		name: "Volunteers",
		group: "Public",
		icon: "id-badge",
		location: relativePath + "services/v4/web/healthcare-suite/ui/Public/index.html",
		count: dao.customDataCount(),
		order: "200"
	};
};
