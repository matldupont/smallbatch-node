(function () {
  'use strict';

  angular
    .module('orders')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('orders', {
        abstract: true,
        url: '/orders',
        template: '<ui-view/>'
      })
      .state('orders.list', {
        url: 'list',
        templateUrl: 'modules/orders/client/views/list-orders.client.view.html',
        controller: 'OrdersListController',
        data: {
          pageTitle: 'Orders List'
        }
      })
      .state('orders.create', {
        url: '/create',
        templateUrl: 'modules/orders/client/views/form-order.client.view.html',
        controller: 'OrdersController',
        resolve: {
          orderResolve: newOrder
        },
        data: {
          pageTitle : 'Orders Create'
        }
      })
      .state('orders.edit', {
        url: '/:orderId/edit',
        templateUrl: 'modules/orders/client/views/form-order.client.view.html',
        controller: 'OrdersController',
        resolve: {
          orderResolve: getOrder
        },
        data: {
          roles: ['guest'],
          pageTitle: 'Edit Order {{ orderResolve.name }}'
        }
      })
      .state('orders.view', {
        url: '/:orderId',
        templateUrl: 'modules/orders/client/views/view-order.client.view.html',
        controller: 'OrdersController',
        controllerAs: 'vm',
        resolve: {
          orderResolve: getOrder
        },
        data:{
          pageTitle: 'Order {{ articleResolve.name }}'
        }
      }).state('order', {
          url: '/order',
          templateUrl: 'modules/orders/client/views/main-order.client.view.html',
          data: {
            pageTitle: 'Order',
            roles: ['guest']
          }
        });
  }

  getOrder.$inject = ['$stateParams', 'OrdersService'];

  function getOrder($stateParams, OrdersService) {
    return OrdersService.get({
      orderId: $stateParams.orderId
    }).$promise;
  }

  newOrder.$inject = ['OrdersService'];

  function newOrder(OrdersService) {
    return new OrdersService();
  }
})();
