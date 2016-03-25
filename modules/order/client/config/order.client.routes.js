(function () {
  'use strict';

  angular
      .module('order')
      .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
        .state('order', {
          abstract: true,
          url: '/order',
          template: '<ui-view/>'
        })
        //.state('order.list', {
        //  url: '',
        //  templateUrl: 'modules/order/client/views/list-order.client.view.html',
        //  controller: 'OrderListController',
        //  controllerAs: 'vm',
        //  data: {
        //    pageTitle: 'Order'
        //  }
        //})
        .state('order.create', {
          url: '/create?mealId',
          templateUrl: 'modules/order/client/views/form-order.client.view.html',
          controller: 'OrderController',
          controllerAs: 'vm',
          //resolve: {
          //  orderResolve: newOrder
          //},
          data: {
            roles: ['user', 'admin'],
            pageTitle : 'Order Create'
          }
        })
        .state('order.edit', {
          url: '/:orderId/edit',
          templateUrl: 'modules/order/client/views/form-course.client.view.html',
          controller: 'OrderController',
          controllerAs: 'vm',
          resolve: {
            orderResolve: getOrder
          },
          data: {
            roles: ['admin'],
            pageTitle: 'Edit Order {{ orderResolve.name }}'
          }
        })
        .state('order.view', {
          url: '',
          templateUrl: 'modules/order/client/views/view-order.client.view.html',
          controller: 'OrderController',
          controllerAs: 'vm',
          //resolve: {
          //  orderResolve: getOrder
          //},
          data:{
            pageTitle: 'Order'
          }
        });
  }

  getOrder.$inject = ['$stateParams', 'OrderService'];

  function getOrder($stateParams, OrderService) {
    return OrderService.currentOrder;
  }

  //newOrder.$inject = ['OrderService'];
  //
  //function newOrder(OrderService) {
  //  return new OrderService();
  //}
})();
