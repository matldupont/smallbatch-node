(function () {
  'use strict';

  angular
    .module('menuItems')
    .controller('MenuItemsListController', MenuItemsListController);

  MenuItemsListController.$inject = ['MenuItemsService'];

  function MenuItemsListController(MenuItemsService) {
    var vm = this;

    vm.menuItems = MenuItemsService.query();
  }
})();
