(function () {
  'use strict';

  angular
    .module('menuItems')
    .controller('MenuItemsListController', MenuItemsListController);

  MenuItemsListController.$inject = ['$scope','MenuItemsService', 'Authentication'];

  function MenuItemsListController($scope, MenuItemsService, Authentication) {
    var vm = this;
    $scope.authentication = Authentication;

    if (Authentication.user) {
      var match = Authentication.user.roles.filter(function (role) {
        return role === 'admin';
      });

      $scope.isAdmin = match.length > 0;
    }

    $scope.menuItems = MenuItemsService.query(function(result) {
      console.log(result);
    });
  }
})();
