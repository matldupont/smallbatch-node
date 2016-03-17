(function () {
  'use strict';

  angular
    .module('meals')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Meals',
      state: 'meals',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'meals', {
      title: 'List Meals',
      state: 'meals.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'meals', {
      title: 'Create Meal',
      state: 'meals.create',
      roles: ['user']
    });
  }
})();
