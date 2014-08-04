'use strict';

describe('Service: webapi', function () {

  // load the service's module
  beforeEach(module('webappApp'));

  // instantiate service
  var webapi;
  beforeEach(inject(function (_webapi_) {
    webapi = _webapi_;
  }));

  it('should do something', function () {
    expect(!!webapi).toBe(true);
  });

});
