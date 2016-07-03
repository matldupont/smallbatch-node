'use strict';

angular.module('core').controller('HomeController', ['$scope', '$document', '$window',
  function ($scope, $document, $window) {
    // This provides Authentication context.

    angular.element(document).ready(function () {
        var marginTop = $window.innerWidth - 967 > 0 ? $window.innerWidth - 967 : 0;
        angular.element('.js-home-text').css('margin-top',  (marginTop * 0.25) + 'px');

        //angular.element('.js-home-text').css('display', 'inherit');
    });

    angular.element($window).bind('resize', function(){
        var marginTop = $window.innerWidth - 967 > 0 ? $window.innerWidth - 967 : 0;
        angular.element('.js-home-text').css('margin-top',  (marginTop * 0.25) + 'px');

        // manuall $digest required as resize event
        // is outside of angular
        $scope.$digest();
    });
  }
]);
