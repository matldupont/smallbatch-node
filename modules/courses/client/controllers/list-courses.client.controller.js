(function () {
  'use strict';

  angular
    .module('courses')
    .controller('CoursesListController', CoursesListController);

  CoursesListController.$inject = ['CoursesService', 'Authentication'];

  function CoursesListController(CoursesService, Authentication) {
    var vm = this;
    vm.authentication = Authentication;

    if (Authentication.user) {
      var match = Authentication.user.roles.filter(function(role) {
        return role === 'admin';
      });

      vm.isAdmin = match.length > 0;
    }

    vm.courses = CoursesService.query();
  }
})();
