/// <reference path="../services/web-api-svc.js" />

'use strict';

function ChartViewModel(webApiSvc, $timeout) {
  var self = {};

  self.webApiSvc = webApiSvc;
  self.$timeout = $timeout;

  self.chartType = 'bar';
  self.model = {};

  self.config = {
    labels: false,
    title: "Percona test chart",
    legend: {
      display: true,
      htmlEnabled: true,
      position: 'right'
    },
    lineLegend: 'traditional'
  }

  return self;
}