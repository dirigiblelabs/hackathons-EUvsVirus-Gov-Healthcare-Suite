angular.module('page', []);
angular.module('page')
.factory('$messageHub', [function(){
	var messageHub = new FramesMessageHub();

	var message = function(evtName, data){
		messageHub.post({data: data}, 'healthcare-suite.Statistics.ReportMedicalEquipment.' + evtName);
	};

	var on = function(topic, callback){
		messageHub.subscribe(callback, topic);
	};

	return {
		message: message,
		on: on,
		onEntityRefresh: function(callback) {
			on('healthcare-suite.Statistics.ReportMedicalEquipment.refresh', callback);
		},
		messageEntityModified: function() {
			message('modified');
		}
	};
}])
.controller('PageController', function ($scope, $http, $messageHub) {

	var api = '../../../../../../../../services/v4/js/healthcare-suite/api/Statistics/ReportMedicalEquipment.js';

	$scope.load = function() {
		$http.get(api)
		.success(function(data) {
			var chartTicks = [];
			var chartData1 = [];
			var chartData2 = [];
			for (var i = 0; i < data.length; i ++) {
				chartTicks.push(data[i].Name);
				chartData1.push(data[i].Quantity);
				chartData2.push(data[i].AvailableQuantity);
			}
			$.jqplot.config.enablePlugins = true;
			$.jqplot('chart', [chartData1, chartData2], {
	            animate: !$.jqplot.use_excanvas,
	            seriesDefaults: {
	                renderer: $.jqplot.BarRenderer,
	                pointLabels: {
	                	show: true
	                }
	            },
	            axes: {
	                xaxis: {
	                    renderer: $.jqplot.CategoryAxisRenderer,
	                    ticks: chartTicks
	                }
	            },
	            highlighter: {
	            	show: false
	            }
	        });
		});
	};
	$scope.load();

	$messageHub.onEntityRefresh($scope.load);

});
