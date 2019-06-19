'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('my app', function() {


  it('should automatically redirect to /trip-form when location hash/fragment is empty', function() {
    browser.get('index.html');
    expect(browser.getLocationAbsUrl()).toMatch("/trip-form");
  });


  describe('trip-form', function() {

    beforeEach(function() {
      browser.get('index.html#!/trip-form');
    });


    it('should render trip-form when user navigates to /trip-form', function() {
      expect(element.all(by.css('[ng-view] p')).first().getText()).
        toMatch(/partial for view 1/);
    });

  });


  describe('trip-view', function() {

    beforeEach(function() {
      browser.get('index.html#!/trip-view');
    });


    it('should render trip-view when user navigates to /trip-view', function() {
      expect(element.all(by.css('[ng-view] p')).first().getText()).
        toMatch(/partial for view 2/);
    });

  });
});
