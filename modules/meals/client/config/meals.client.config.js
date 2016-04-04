(function () {
  'use strict';

  angular
    .module('meals')
    .run(menuConfig);

  menuConfig.$inject = ['Menus', 'MealsService'];

  function menuConfig(Menus, MealsService) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Meals',
      state: 'meals',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'meals', {
      title: 'All Meals',
      state: 'meals.list'
    });

    //Add separator
    Menus.addSubMenuItem('topbar', 'meals', {
      roles: ['admin','user']
    });
    MealsService.query(function(result) {
      var meals = result;
      angular.forEach(meals, function(meal) {
        Menus.addSubMenuItem('topbar','meals', {
          title: meal.name,
          state: 'meals.view({ mealId: "' + meal._id + '" })',
          roles: ['user']
        });
      });
      //Add separator
      Menus.addSubMenuItem('topbar','meals', {
        roles: ['admin']
      });

      // Add the dropdown create item
      Menus.addSubMenuItem('topbar', 'meals', {
        title: 'Create Meal',
        state: 'meals.create',
        roles: ['admin']
      });
    });
  }
})();
