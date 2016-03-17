(function () {
  'use strict';

  describe('MenuItems Route Tests', function () {
    // Initialize global variables
    var $scope,
      MenuItemsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _MenuItemsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      MenuItemsService = _MenuItemsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('menuitems');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/menuitems');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          MenuItemsController,
          mockMenuItem;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('menuitems.view');
          $templateCache.put('modules/menuitems/client/views/view-menuitem.client.view.html', '');

          // create mock MenuItem
          mockMenuItem = new MenuItemsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'MenuItem Name'
          });

          //Initialize Controller
          MenuItemsController = $controller('MenuItemsController as vm', {
            $scope: $scope,
            menuItemResolve: mockMenuItem
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:menuItemId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.menuItemResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            menuItemId: 1
          })).toEqual('/menuitems/1');
        }));

        it('should attach an MenuItem to the controller scope', function () {
          expect($scope.vm.menuItem._id).toBe(mockMenuItem._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/menuitems/client/views/view-menuitem.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          MenuItemsController,
          mockMenuItem;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('menuitems.create');
          $templateCache.put('modules/menuitems/client/views/form-menuitem.client.view.html', '');

          // create mock MenuItem
          mockMenuItem = new MenuItemsService();

          //Initialize Controller
          MenuItemsController = $controller('MenuItemsController as vm', {
            $scope: $scope,
            menuItemResolve: mockMenuItem
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.menuItemResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/menuitems/create');
        }));

        it('should attach an MenuItem to the controller scope', function () {
          expect($scope.vm.menuItem._id).toBe(mockMenuItem._id);
          expect($scope.vm.menuItem._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/menuitems/client/views/form-menuitem.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          MenuItemsController,
          mockMenuItem;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('menuitems.edit');
          $templateCache.put('modules/menuitems/client/views/form-menuitem.client.view.html', '');

          // create mock MenuItem
          mockMenuItem = new MenuItemsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'MenuItem Name'
          });

          //Initialize Controller
          MenuItemsController = $controller('MenuItemsController as vm', {
            $scope: $scope,
            menuItemResolve: mockMenuItem
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:menuItemId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.menuItemResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            menuItemId: 1
          })).toEqual('/menuitems/1/edit');
        }));

        it('should attach an MenuItem to the controller scope', function () {
          expect($scope.vm.menuItem._id).toBe(mockMenuItem._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/menuitems/client/views/form-menuitem.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
