'use strict';

/* Controllers */

angular.module('controllers', []).
  controller('AppCtrl', function ($scope, $http, $timeout, $window) {
    var socket = io();
    var statusTimer = false;
    socket.on('presence', function (msg) {
      console.log('IO:presence', msg);
    });
    socket.on('connect', function () {
      console.log('IO:connect');
    });
    socket.on('disconnect', function () {
      console.log('IO:disconnect');
    });
    socket.on('reconnect', function () {
      //in case server is restarted reload the whole page
      console.log('IO:reconnect');
      $window.location.reload();
    });

    socket.on('auth', function (msg) {
      if (msg.activity == 'start') {
        $scope.auth = true;
      }
      if (msg.activity == 'stop') {
        $scope.auth = false;
      }
    });

    $scope.status = false;

    $http({
      method: 'GET',
      url: 'api/status'
    }).
      success(function (data, status, headers, config) {
        //$timeout(function () { $scope.status = true; }, 2000);
        $scope.status = true;

      }).
      error(function (data, status, headers, config) {
        $scope.status = false;
      });

  });

