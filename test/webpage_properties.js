var express = require('express'),
    assert = require('assert'),
    phantomProxy = require('../index'),
    should = require('should');

var properties = ['clipRect', 'content', 'cookies', 'customHeaders', 'frameContent', 'framePlainText', 'frameUrl', 'libraryPath', 'navigationLocked', 'paperSize', 'plainText', 'settings', 'url', 'viewportSize', 'zoomFactor'];

var server = express();
server.listen(3003);
var phantom, page;

function property_get_tester(propertyName) {
  it(propertyName + " is working", function(done) {
    page.get(propertyName, function(result) {
      assert(true); // don't care if no exception
      done();
    });
  });
};

describe("phantomjs.webpage module properties can be read via get", function() {
  before(function(done){
      server.get('/', function(req, res) {
          res.send("hello world");
      });
      done();
  });

  before(function(done) {
      phantomProxy.create({}, function(proxy) {
          phantom = proxy;
          done();
      });
  });

  after(function(done) {
      phantomProxy.end();
      done();
  });

  beforeEach(function(done) {
      page = phantom.page;
      page.open("http://localhost:3003/", function() {
          done();
      });
  });

  afterEach(function(done) {
      done();
  });

  properties.forEach(function(property) {
    property_get_tester(property);
  });

  it("invalid property name should throw exception", function(done) {
    page.get('totaly_invalid_property', function(result, err) {
      done();
      assert.equal(result, null);
      assert.ok(err instanceof Error);
    })
  });

  it("in valid property err is null", function(done) {
    page.get('url', function(result, err) {
      done();
      assert.notEqual(result, null);
      assert.equal(err, null);
    })
  });

  it("property url works actually", function(done) {
    page.get('url', function(result) {
      assert.equal(result, "http://localhost:3003/");
      done();
    });
  });
});

