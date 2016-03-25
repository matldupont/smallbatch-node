/**
 * Created by mat on 16-03-22.
 */
(function() {
  'use strict';

  angular
      .module('meals')
      .filter('menuItemsByCourse', function() {
        return function (menuItems, courseId) {
          return menuItems;
          //var filtered = [];
          //if (!usedCourses) {
          //  return courses;
          //}
          //angular.forEach(courses, function (course) {
          //  var found = false;
          //
          //  var matches = usedCourses.filter(function(usedCourse) {
          //    return usedCourse.id === course._id;
          //  });
          //  if (matches.length === 0) {
          //    filtered.push(course);
          //  }
          //});
          //return filtered;
        };
      });
})();

