'use strict';

describe('MenuItems E2E Tests:', function () {
  describe('Test MenuItems page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/menuitems');
      expect(element.all(by.repeater('menuItem in menuItems')).count()).toEqual(0);
    });
  });
});
