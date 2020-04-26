angular.module('page', ['ngAnimate', 'ui.bootstrap']);
angular.module('page')
.factory('httpRequestInterceptor', function () {
	var csrfToken = null;
	return {
		request: function (config) {
			config.headers['X-Requested-With'] = 'Fetch';
			config.headers['X-CSRF-Token'] = csrfToken ? csrfToken : 'Fetch';
			return config;
		},
		response: function(response) {
			var token = response.headers()['x-csrf-token'];
			if (token) {
				csrfToken = token;
			}
			return response;
		}
	};
})
.config(['$httpProvider', function($httpProvider) {
	$httpProvider.interceptors.push('httpRequestInterceptor');
}])
.factory('$messageHub', [function(){
	var messageHub = new FramesMessageHub();

	var message = function(evtName, data){
		messageHub.post({data: data}, 'healthcare-suite.Hospitals.HospitalPatients.' + evtName);
	};

	var on = function(topic, callback){
		messageHub.subscribe(callback, topic);
	};

	return {
		message: message,
		on: on,
		onEntityRefresh: function(callback) {
			on('healthcare-suite.Hospitals.HospitalPatients.refresh', callback);
		},
		onPatientsModified: function(callback) {
			on('healthcare-suite.Hospitals.Patients.modified', callback);
		},
		onConditionTypesModified: function(callback) {
			on('healthcare-suite.Hospitals.ConditionTypes.modified', callback);
		},
		onOutcomeTypesModified: function(callback) {
			on('healthcare-suite.Hospitals.OutcomeTypes.modified', callback);
		},
		onHospitalsSelected: function(callback) {
			on('healthcare-suite.Hospitals.Hospitals.selected', callback);
		},
		messageEntityModified: function() {
			message('modified');
		}
	};
}])
.controller('PageController', function ($scope, $http, $messageHub) {

	var api = '../../../../../../../../../../services/v4/js/healthcare-suite/api/Hospitals/HospitalPatients.js';
	var patientOptionsApi = '../../../../../../../../../../services/v4/js/healthcare-suite/api/Hospitals/Patients.js';
	var conditionOptionsApi = '../../../../../../../../../../services/v4/js/healthcare-suite/api/Hospitals/ConditionTypes.js';
	var outcomeOptionsApi = '../../../../../../../../../../services/v4/js/healthcare-suite/api/Hospitals/OutcomeTypes.js';

	$scope.dateOptions = {
		startingDay: 1
	};
	$scope.dateFormats = ['yyyy/MM/dd', 'dd-MMMM-yyyy', 'dd.MM.yyyy', 'shortDate'];
	$scope.dateFormat = $scope.dateFormats[0];

	$scope.patientOptions = [];

	$scope.conditionOptions = [];

	$scope.outcomeOptions = [];

	function patientOptionsLoad() {
		$http.get(patientOptionsApi)
		.success(function(data) {
			$scope.patientOptions = data;
		});
	}
	patientOptionsLoad();

	function conditionOptionsLoad() {
		$http.get(conditionOptionsApi)
		.success(function(data) {
			$scope.conditionOptions = data;
		});
	}
	conditionOptionsLoad();

	function outcomeOptionsLoad() {
		$http.get(outcomeOptionsApi)
		.success(function(data) {
			$scope.outcomeOptions = data;
		});
	}
	outcomeOptionsLoad();

	$scope.dataPage = 1;
	$scope.dataCount = 0;
	$scope.dataOffset = 0;
	$scope.dataLimit = 10;

	$scope.getPages = function() {
		return new Array($scope.dataPages);
	};

	$scope.nextPage = function() {
		if ($scope.dataPage < $scope.dataPages) {
			$scope.loadPage($scope.dataPage + 1);
		}
	};

	$scope.previousPage = function() {
		if ($scope.dataPage > 1) {
			$scope.loadPage($scope.dataPage - 1);
		}
	};

	$scope.loadPage = function(pageNumber) {
		$scope.dataPage = pageNumber;
		$http.get(api + '/count')
		.success(function(data) {
			$scope.dataCount = data;
			$scope.dataPages = Math.ceil($scope.dataCount / $scope.dataLimit);
			$http.get(api + '?Hospital=' + $scope.masterEntityId + '&$offset=' + ((pageNumber - 1) * $scope.dataLimit) + '&$limit=' + $scope.dataLimit)
			.success(function(data) {
				$scope.data = data;
			});
		});
	};

	$scope.openNewDialog = function() {
		$scope.actionType = 'new';
		$scope.entity = {};
		toggleEntityModal();
	};

	$scope.openEditDialog = function(entity) {
		$scope.actionType = 'update';
		$scope.entity = entity;
		toggleEntityModal();
	};

	$scope.openDeleteDialog = function(entity) {
		$scope.actionType = 'delete';
		$scope.entity = entity;
		toggleEntityModal();
	};

	$scope.close = function() {
		$scope.loadPage($scope.dataPage);
		toggleEntityModal();
	};

	$scope.create = function() {
		$scope.entity.Hospital = $scope.masterEntityId;
		$http.post(api, JSON.stringify($scope.entity))
		.success(function(data) {
			$scope.loadPage($scope.dataPage);
			toggleEntityModal();
			$messageHub.messageEntityModified();
		}).error(function(data) {
			alert(JSON.stringify(data));
		});
			
	};

	$scope.update = function() {
		$scope.entity.Hospital = $scope.masterEntityId;

		$http.put(api + '/' + $scope.entity.Id, JSON.stringify($scope.entity))
		.success(function(data) {
			$scope.loadPage($scope.dataPage);
			toggleEntityModal();
			$messageHub.messageEntityModified();
		}).error(function(data) {
			alert(JSON.stringify(data));
		})
	};

	$scope.delete = function() {
		$http.delete(api + '/' + $scope.entity.Id)
		.success(function(data) {
			$scope.loadPage($scope.dataPage);
			toggleEntityModal();
			$messageHub.messageEntityModified();
		}).error(function(data) {
			alert(JSON.stringify(data));
		});
	};

	$scope.updateCalculatedProperties = function() {
		var entity = $scope.entity;
	};

	$scope.entrydateOpenCalendar = function($event) {
		$scope.entrydateCalendarStatus.opened = true;
	};

	$scope.entrydateCalendarStatus = {
		opened: false
	};

	$scope.exitdateOpenCalendar = function($event) {
		$scope.exitdateCalendarStatus.opened = true;
	};

	$scope.exitdateCalendarStatus = {
		opened: false
	};

	$scope.patientOptionValue = function(optionKey) {
		for (var i = 0 ; i < $scope.patientOptions.length; i ++) {
			if ($scope.patientOptions[i].Id === optionKey) {
				return $scope.patientOptions[i].Name;
			}
		}
		return null;
	};
	$scope.conditionOptionValue = function(optionKey) {
		for (var i = 0 ; i < $scope.conditionOptions.length; i ++) {
			if ($scope.conditionOptions[i].Id === optionKey) {
				return $scope.conditionOptions[i].Name;
			}
		}
		return null;
	};
	$scope.outcomeOptionValue = function(optionKey) {
		for (var i = 0 ; i < $scope.outcomeOptions.length; i ++) {
			if ($scope.outcomeOptions[i].Id === optionKey) {
				return $scope.outcomeOptions[i].Name;
			}
		}
		return null;
	};

	$messageHub.onEntityRefresh($scope.loadPage($scope.dataPage));
	$messageHub.onPatientsModified(patientOptionsLoad);
	$messageHub.onConditionTypesModified(conditionOptionsLoad);
	$messageHub.onOutcomeTypesModified(outcomeOptionsLoad);

	$messageHub.onHospitalsSelected(function(event) {
		$scope.masterEntityId = event.data.id;
		$scope.loadPage($scope.dataPage);
	});

	function toggleEntityModal() {
		$('#entityModal').modal('toggle');
	}
});
