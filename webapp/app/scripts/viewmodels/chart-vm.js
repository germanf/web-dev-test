/// <reference path="../services/web-api-svc.js" />

'use strict';

function ChartViewModel(webApiSvc, $timeout) {
  var self = {};

  self.webApiSvc = webApiSvc;
  self.$timeout = $timeout;

  self.chartType = 'bar';
  self.model = initModel();
  self.config = initConfig();

  self.getCharts = getCharts;
  self.getChart = getChart;
  self.getChartData = getChartData;
  self.getDataForDate = getDataForDate;

  self.chartData = getChartData;
  self.isLoadingCharts = false;

  self.setDefaultData = setDefaultData;
  self.setMinData = setMinData;
  self.setAvgData = setAvgData;
  self.setMaxData = setMaxData;

  // functions
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

  function isChartLoaded(chart) {
    return self.model.charts.hasOwnProperty(chart) && chart.data && chart.data.length;
  }

  function initModel() {
    return {
      charts: [],
      dataForDate: {
        date: '',
        data: []
      }
    };
  }

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

  function getChartData(chartId) {
    return self.webApiSvc.getData({ id: chartId })
      .$promise.then(function (result) {
        self.model.charts.some(function (chart) {
          if (chart.id === chartId) {
            chart.data = { data: [], series: [] };
            for (var i = 0; i < result.length; i++) {
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

  function setDefaultData(chart) {
    var lenData = chart.data.data.length;
    var data = chart.data;

    for (var i = 0; i < lenData; i++) {
      chart.data.data[i].y.length = 0;
      chart.data.data[i].y = angular.copy(chart.originalData[i].data);
    }
  }

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

  return self;
}