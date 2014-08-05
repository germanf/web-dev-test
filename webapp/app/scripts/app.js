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
  var chart = $resource(
    'http://localhost:3000/charts/:id', { id: '@id' },
    {
      data: {
        method: 'GET',
        params: { id: '@id' },
        url: 'http://localhost:3000/charts/:id/data/',
        isArray: true
      },
      dataForDate: {
        method: 'GET',
        params: { id: '@id', date: '@date' },
        url: 'http://localhost:3000/charts/:id/data/:date',
        isArray: false
      }
    });

  var api = {
    get: chart.get,
    query: chart.query,
    getData: chart.data,
    getDataForDate: chart.dataForDate
  };

  return api;
});

app.factory('chartViewModel', function (webApiSvc) {
  return new ChartViewModel(webApiSvc);
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
