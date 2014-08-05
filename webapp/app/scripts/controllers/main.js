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

    //initialize
    $scope.vm.getCharts();
  }]);
