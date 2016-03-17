'use strict';

describe('Meals E2E Tests:', function () {
  describe('Test Meals page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/meals');
      expect(element.all(by.repeater('meal in meals')).count()).toEqual(0);
    });
  });
});
