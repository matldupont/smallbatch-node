(function () {
  'use strict';

  //angular
  //  .module('menuItems')
  //  .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Menu',
      state: 'menuitems',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'menuitems', {
      title: 'All Menu Items',
      state: 'menuitems.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'menuitems', {
      title: 'New Menu Item',
      state: 'menuitems.create',
      roles: ['user']
    });
  }
})();
