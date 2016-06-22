(function () {
  'use strict';

  angular
    .module('courses')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.courses', {
        abstract: true,
        url: '/courses',
        template: '<ui-view/>'
      })
      .state('admin.courses.list', {
        url: '',
        templateUrl: 'modules/courses/client/views/list-courses.client.view.html',
        controller: 'CoursesListController',
        data: {
          roles: ['admin'],
          pageTitle: 'Courses List'
        }
      })
      .state('admin.courses.create', {
        url: '/create',
        templateUrl: 'modules/courses/client/views/form-course.client.view.html',
        controller: 'CoursesController',
        resolve: {
          courseResolve: newCourse
        },
        data: {
          roles: ['admin'],
          pageTitle : 'Courses Create'
        }
      })
      .state('admin.courses.edit', {
        url: '/:courseId/edit',
        templateUrl: 'modules/courses/client/views/form-course.client.view.html',
        controller: 'CoursesController',
        resolve: {
          courseResolve: getCourse
        },
        data: {
          roles: ['admin'],
          pageTitle: 'Edit Course {{ courseResolve.name }}'
        }
      })
      .state('admin.courses.view', {
        url: '/:courseId',
        templateUrl: 'modules/courses/client/views/view-course.client.view.html',
        controller: 'CoursesController',
        resolve: {
          courseResolve: getCourse
        },
        data:{
          roles: ['admin'],
          pageTitle: 'Course {{ articleResolve.name }}'
        }
      });
  }

  getCourse.$inject = ['$stateParams', 'CoursesService'];

  function getCourse($stateParams, CoursesService) {
    return CoursesService.get({
      courseId: $stateParams.courseId
    }).$promise;
  }

  newCourse.$inject = ['CoursesService'];

  function newCourse(CoursesService) {
    return new CoursesService();
  }
})();
