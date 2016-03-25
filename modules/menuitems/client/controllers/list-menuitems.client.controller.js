(function () {
  'use strict';

  angular
    .module('menuItems')
    .controller('MenuItemsListController', MenuItemsListController);

  MenuItemsListController.$inject = ['MenuItemsService', 'Authentication'];

  function MenuItemsListController(MenuItemsService, Authentication) {
    var vm = this;
    vm.authentication = Authentication;

    if (Authentication.user) {
      var match = Authentication.user.roles.filter(function (role) {
        return role === 'admin';
      });

      vm.isAdmin = match.length > 0;
    }

    vm.menuItems = MenuItemsService.query();
  }
})();
