(function () {
  'use strict';

  angular
    .module('menuItems')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.menuitems', {
        abstract: true,
        url: '/menuitems',
        template: '<ui-view/>'
      })
      .state('admin.menuitems.list', {
        url: '',
        templateUrl: 'modules/menuitems/client/views/list-menuitems.client.view.html',
        controller: 'MenuItemsListController',
        data: {
          roles: ['admin'],
          pageTitle: 'Menu'
        }
      })
      .state('admin.menuitems.create', {
        url: '/create?course',
        templateUrl: 'modules/menuitems/client/views/form-menuitem.client.view.html',
        controller: 'MenuItemsController',
        resolve: {
          menuItemResolve: newMenuItem
        },
        data: {
          roles: ['admin'],
          pageTitle : 'Menu Add'
        }
      })
      .state('admin.menuitems.edit', {
        url: '/:menuItemId/edit',
        templateUrl: 'modules/menuitems/client/views/form-menuitem.client.view.html',
        controller: 'MenuItemsController',
        resolve: {
          menuItemResolve: getMenuItem
        },
        data: {
          roles: ['admin'],
          pageTitle: 'Edit {{ menuItemResolve.name }}'
        }
      })
      .state('admin.menuitems.view', {
        url: '/:menuItemId',
        templateUrl: 'modules/menuitems/client/views/view-menuitem.client.view.html',
        controller: 'MenuItemsController',
        resolve: {
          menuItemResolve: getMenuItem
        },
        data:{
          roles: ['admin'],
          pageTitle: '{{ articleResolve.name }}'
        }
      })
      .state('menu', {
        url: '/menu',
        templateUrl: 'modules/menuitems/client/views/main-menuitems.client.view.html',
        controller: 'MenuItemsListController',
        data: {
          pageTitle: 'Menu'
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
