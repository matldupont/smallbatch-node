/**
 * Created by mat on 16-03-22.
 */
(function() {
  'use strict';

  angular
      .module('meals')
      .filter('menuItemsByCourse', function() {
        return function (menuItems, courseId) {
            var filteredItems = menuItems.filter(function(menuItem) {
                return menuItem.course.id === courseId;
            });

            return filteredItems;
        };
      });
})();

