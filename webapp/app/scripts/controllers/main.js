'use strict';

/**
 * @ngdoc function
 * @name webappApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the webappApp
 */
angular.module('webappApp')
  .controller('MainCtrl', ['chartViewModel', '$scope', function (chartViewModel, $scope) {
    $scope.vm = chartViewModel;

    //retrieve charts
    $scope.vm.getCharts();
  }]);
