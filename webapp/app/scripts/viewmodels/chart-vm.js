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

  // privates
  function getChartData() {
    //transform charts
  }

  function initModel() {
    return {
      charts: [],
      //currentChart: {
      //  id: '',
      //  name: '',
      //  description: '',
      //  data: []
      //},

      dataForDate: {
        date: '',
        data: []
      }
    };
  }

  function initConfig() {
    return {
      labels: false,
      title: "Percona test chart",
      legend: {
        display: true,
        htmlEnabled: true,
        position: 'right'
      },
      lineLegend: 'traditional'
    };
  }

  function getCharts() {
    self.webApiSvc.query()
      .$promise.then(function (charts) {
        self.model.charts.length = 0;
        for (var i = 0; i < charts.length; i++) {
          var chart = charts[i]
          self.model.charts.push(chart);
          self.getChart(chart.id);
          self.getChartData(chart.id);
        }
      });
  }

  function getChart(chartId) {
    var id = chartId;
    self.webApiSvc.get({ id: id })
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
    self.webApiSvc.getData({ id: chartId })
      .$promise.then(function (result) {
        self.model.charts.some(function (chart) {
          if (chart.id === chartId) {
            chart.data = [];
            for (var i = 0; i < result.length; i++) {
              chart.data.push(result[i]);
            }
            return true;
          }
        });
      });
  };

  function getDataForDate(chartId, date) {
    self.webApiSvc.get({ id: chartId, date: date })
      .$promise.then(function (result) {
        self.model.dataForDate.date = result.date;

        self.model.dataForDate.data.length = 0;
        for (var data in result) {
          self.model.dataForDate.data.push(data);
        }
      });
  };

  return self;
}