'use strict';

angular.module('core').controller('AdminController', ['$scope', '$location', '$http', '$state', 'Authentication', 'Menus', 'OrderService',
    function ($scope, $location, $http, $state, Authentication, Menus, OrderService) {
        // Expose view variables
        $scope.$state = $state;
        $scope.authentication = Authentication;
        $scope.currentOrder = OrderService.currentOrder;

        $scope.test = "ADMIN";
        // Get the topbar menu
        $scope.menu = Menus.getMenu('topbar');

        // Get the account menu
        $scope.accountMenu = Menus.getMenu('account').items[0];

        // Toggle the menu items
        $scope.isCollapsed = false;
        $scope.toggleCollapsibleMenu = function () {
            $scope.isCollapsed = !$scope.isCollapsed;
        };

        // Collapsing the menu after navigation
        $scope.$on('$stateChangeSuccess', function () {
            $scope.isCollapsed = false;
        });

        $scope.logout = function() {
            OrderService.clearOrder();
            window.location.href = '/api/auth/signout';
        };

        $scope.$watch(function() {
            return Authentication.user;
        }, function(user) {
            var match = [];
            if (user) {
                match = user.roles.filter(function(role) {
                    return role === 'admin';
                });
            }
            $scope.isAdmin = match.length > 0;
        });
    }
]);

