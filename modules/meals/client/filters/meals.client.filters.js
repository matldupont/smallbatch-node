/**
 * Created by mat on 16-03-17.
 */
(function() {
  'use strict';

  angular
      .module('meals')
      .filter('unusedCourses', function() {
        return function (courses, usedCourses) {
          var filtered = [];
          if (!usedCourses) {
            return courses;
          }
          angular.forEach(courses, function (course) {
            var found = false;

            var matches = usedCourses.filter(function(usedCourse) {
              return usedCourse.id === course._id;
            });
            if (matches.length === 0) {
              filtered.push(course);
            }
          });
          return filtered;
        };
      });
})();
