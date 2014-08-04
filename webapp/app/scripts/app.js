/// <reference path="viewmodels/chart-vm.js" />

'use strict';

/**
 * @ngdoc overview
 * @name webappApp
 * @description
 * # webappApp
 *
 * Main module of the application.
 */
var app = angular
  .module('webappApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'angularCharts'
  ]);

app.factory('webApiSvc', function ($resource) {
  // Rest API
  return {
    someMethod: function () {
      return meaningOfLife;
    },
    getCharts: $resource('http://localhost:3000/charts', {}),
    getChart: $resource('http://localhost:3000/charts/:id', { id: '@chartId' }),
    getChartData: $resource('http://localhost:3000/charts/:id/data', { id: '@chartId' }),
    getChartDataByDate: $resource('http://localhost:3000/charts/3/data/2013-02-01', { id: '@chartId', date: '@date' })
  };
});

app.factory('chartViewModel', function (webApiSvc, $timeout) {
  return new ChartViewModel(webapi, $timeout);
});

app.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/main.html',
      controller: 'MainCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
});
