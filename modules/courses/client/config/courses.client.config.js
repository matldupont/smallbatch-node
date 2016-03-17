(function () {
  'use strict';

  angular
    .module('courses')
    .run(menuConfig);

  menuConfig.$inject = ['Menus','CoursesService'];

  function menuConfig(Menus, CoursesService) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Menu',
      state: 'courses',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'courses', {
      title: 'All Menu Items',
      state: 'menuitems.list'
    });

    //Add separator
    Menus.addSubMenuItem('topbar', 'courses', { });
    CoursesService.query(function(result) {
      var courses = result;
      angular.forEach(courses, function(course) {
        Menus.addSubMenuItem('topbar','courses', {
          title: course.name,
          state: 'courses.view({ courseId: "' + course._id + '" })'
        });
      });
      //Add separator
      Menus.addSubMenuItem('topbar','courses', { });
      // Add the dropdown create item
      Menus.addSubMenuItem('topbar', 'courses', {
        title: 'Course List',
        state: 'courses.list',
        roles: ['user']
      });

    });
  }
})();
