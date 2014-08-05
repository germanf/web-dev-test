/// <reference path="../services/web-api-svc.js" />

'use strict';

/**
 * @ngdoc function
 * @name webappApp.viewmodel:ChartViewModel
 * @description
 * # ChartViewModel
 * ViewModel for charts
 */
function ChartViewModel(webApiSvc) {
  var self = {};

  self.webApiSvc = webApiSvc;

  self.chartType = 'bar';
  self.model = initModel();
  self.config = initConfig();

  self.getCharts = getCharts;
  self.getChart = getChart;
  self.getChartData = getChartData;
  self.getDataForDate = getDataForDate;
  self.getChartData = getChartData;

  self.aggregateFn = 'aggregateFnDefault';
  self.setDefaultData = setDefaultData;
  self.setMinData = setMinData;
  self.setAvgData = setAvgData;
  self.setMaxData = setMaxData;

  self.updateDate = updateDate;

  // functions

  /**
 * get all charts data
 */
  function getChartData() {
    var chartData = { series: [], data: [] };
    for (var chart in self.model.charts) {
      if (self.isChartLoaded(chart)) {
        chartData.series.push(chart.description);
        for (var data in chart.data) {
        }
      }
    }
    return chartData;
  }

  /**
 * verify if the given chart is already loaded
 */
  function isChartLoaded(chart) {
    return self.model.charts.hasOwnProperty(chart) && chart.data && chart.data.length;
  }

  /**
 * initialize angular-charts model
 */
  function initModel() {
    return {
      charts: [],
      dataForDate: {
        date: '',
        data: []
      }
    };
  }

  /**
 * initialize angular-charts config 
 */
  function initConfig() {
    return {
      labels: false,
      legend: {
        display: true,
        htmlEnabled: true,
        position: 'right'
      },
      lineLegend: 'traditional'
    };
  }

  /**
 * get all charts
 */
  function getCharts() {
    return self.webApiSvc.query()
      .$promise.then(function (charts) {
        self.model.charts.length = 0;
        for (var i = 0; i < charts.length; i++) {
          var chart = charts[i];
          chart.chartType = 'bar';
          chart.originalData = [];
          self.model.charts.push(chart);
          self.getChart(chart.id);
          self.getChartData(chart.id);
        }
      });
  }

  /**
 * get chart for the given chartId
 */
  function getChart(chartId) {
    var id = chartId;
    return self.webApiSvc.get({ id: id })
      .$promise.then(function (chart) {
        self.model.charts.some(function (obj) {
          if (obj.id === id) {
            obj.description = chart.description;
            return true;
          }
        });
      });
  };

  /**
 * get chart data for the given chartId
 */
  function getChartData(chartId) {
    return self.webApiSvc.getData({ id: chartId })
      .$promise.then(function (result) {
        self.model.charts.some(function (chart) {
          if (chart.id === chartId) {
            chart.data = { data: [], series: [] };
            var len = result.length
            for (var i = 0; i < len; i++) {
              var chartData = result[i];
              chart.originalData.push(angular.copy(chartData));
              chart.data.series.push(chartData.date);
              chart.data.data.push({ x: chartData.date, y: chartData.data });
            }
            return true;
          }
        });
      });
  };

  /**
 * get chart data for the given tuple chartId & date
 */
  function getDataForDate(chartId, date) {
    return self.webApiSvc.get({ id: chartId, date: date })
      .$promise.then(function (result) {
        self.model.dataForDate.date = result.date;

        self.model.dataForDate.data.length = 0;
        for (var data in result) {
          var chartData = { x: data.date, y: data.data };
          self.model.dataForDate.data.push(chartData);
        }
      });
  };

  /**
 * Set default data
 */
  function setDefaultData(chart) {
    var lenData = chart.originalData.length;

    chart.data.series.length = 0;
    chart.data.data.length = 0;

    for (var i = 0; i < lenData; i++) {
      var chartData = angular.copy(chart.originalData[i]);

      chart.data.series.push(chartData.date);
      chart.data.data.push({ x: chartData.date, y: chartData.data });
    }
  }

  /**
 * aggregate function Min
 */
  function setMinData(chart) {
    var chartData = chart.data;
    var originalData = angular.copy(chart.originalData);
    var lenData = originalData.length;

    for (var i = 0; i < lenData; i++) {
      var min = Number.MAX_VALUE;
      var originalY = originalData[i].data;
      var yLength = originalY.length;
      var y = chartData.data[i].y;

      for (var j = 0; j < yLength; j++)
        if (originalY[j] < min) min = originalY[j];

      y.length = 0;
      y.push(min);
    }
  }

  /**
 * aggregate function Avg
 */
  function setAvgData(chart) {
    var chartData = chart.data;
    var originalData = angular.copy(chart.originalData);
    var lenData = originalData.length;

    for (var i = 0; i < lenData; i++) {
      var sum = 0;
      var originalY = originalData[i].data;
      var yLength = originalY.length;
      var y = chartData.data[i].y;

      for (var j = 0; j < yLength; j++)
        sum += originalY[j];

      y.length = 0;
      y.push(sum / yLength);
    }
  }

  /**
   * aggregate function Max
   */
  function setMaxData(chart) {
    var chartData = chart.data;
    var originalData = angular.copy(chart.originalData);
    var lenData = originalData.length;

    for (var i = 0; i < lenData; i++) {
      var max = Number.MIN_VALUE;
      var originalY = originalData[i].data;
      var yLength = originalY.length;
      var y = chartData.data[i].y;

      for (var j = 0; j < yLength; j++)
        if (originalY[j] > max) max = originalY[j];

      y.length = 0;
      y.push(max);
    }
  }

  /**
   * update chart with the given date
   */
  function updateDate(chart) {
    self.setDefaultData(chart);

    if (chart.dateSelected) {
      var data = {};
      chart.data.series.length = 0;
      chart.data.series.push(chart.dateSelected.date);

      chart.data.data.some(function (element, index, array) {
        if (element.x === chart.dateSelected.date) {
          data = angular.copy(element);
          return true;
        }
      });
      chart.data.data.length = 0;
      chart.data.data.push(data);
    } else {
      self.aggregateFn = 'aggregateFnDefault';
    }
  }

  return self;
}