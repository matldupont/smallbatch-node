//MenuItems service used to communicate MenuItems REST endpoints
(function () {
  'use strict';

  angular
    .module('menuItems')
    .factory('MenuItemsService', MenuItemsService);

  MenuItemsService.$inject = ['$resource'];

  function MenuItemsService($resource) {
    return $resource('api/menuitems/:menuItemId', {
      menuItemId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
