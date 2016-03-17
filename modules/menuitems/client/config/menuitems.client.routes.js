(function () {
  'use strict';

  angular
    .module('menuItems')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('menuitems', {
        abstract: true,
        url: '/menuitems',
        template: '<ui-view/>'
      })
      .state('menuitems.list', {
        url: '',
        templateUrl: 'modules/menuitems/client/views/list-menuitems.client.view.html',
        controller: 'MenuItemsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Menu'
        }
      })
      .state('menuitems.create', {
        url: '/create?course',
        templateUrl: 'modules/menuitems/client/views/form-menuitem.client.view.html',
        controller: 'MenuItemsController',
        controllerAs: 'vm',
        resolve: {
          menuItemResolve: newMenuItem
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Menu Add'
        }
      })
      .state('menuitems.edit', {
        url: '/:menuItemId/edit',
        templateUrl: 'modules/menuitems/client/views/form-menuitem.client.view.html',
        controller: 'MenuItemsController',
        controllerAs: 'vm',
        resolve: {
          menuItemResolve: getMenuItem
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit {{ menuItemResolve.name }}'
        }
      })
      .state('menuitems.view', {
        url: '/:menuItemId',
        templateUrl: 'modules/menuitems/client/views/view-menuitem.client.view.html',
        controller: 'MenuItemsController',
        controllerAs: 'vm',
        resolve: {
          menuItemResolve: getMenuItem
        },
        data:{
          pageTitle: '{{ articleResolve.name }}'
        }
      });
  }

  getMenuItem.$inject = ['$stateParams', 'MenuItemsService'];

  function getMenuItem($stateParams, MenuItemsService) {
    return MenuItemsService.get({
      menuItemId: $stateParams.menuItemId
    }).$promise;
  }

  newMenuItem.$inject = ['MenuItemsService'];

  function newMenuItem(MenuItemsService) {
    return new MenuItemsService();
  }
})();
