'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$rootScope', '$location', '$http', '$state',
  function ($scope, $rootScope, $location, $http, $state) {
    // Expose view variables
    $scope.$state = $state;
    $scope.showNav = false;

    $scope.showCartIcon = function() {
        return $state.includes('order');
    };

    $scope.toggleOrderSummary = function() {
      $rootScope.$emit('cart-summary-popup');
    };

    $scope.toggleNav = function() {
      $scope.showNav = !$scope.showNav;
    };

  }
]);
