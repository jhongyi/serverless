'use strict';

/**
 * Test: Serverless State Class
 */

let Serverless = require('../../../lib/Serverless.js'),
  SPlugin    = require('../../../lib/ServerlessPlugin'),
  path       = require('path'),
  utils      = require('../../../lib/utils/index'),
  assert     = require('chai').assert,
  testUtils  = require('../../test_utils'),
  config     = require('../../config');

let serverless;
let instance;

describe('Test Serverless State Class', function() {

  before(function(done) {
    this.timeout(0);
    testUtils.createTestProject(config)
      .then(projPath => {

        process.chdir(projPath);

        // Instantiate Serverless
        serverless = new Serverless({
          interactive: false,
          projectPath: projPath
        });

        // Instantiate Class
        instance = new serverless.classes.State(serverless);

        done();
      });
  });

  after(function(done) {
    done();
  });

  describe('Tests', function() {

    it('Load instance from file system', function(done) {
      instance.load()
        .then(function(instance) {
          done();
        })
        .catch(e => {
          done(e);
        });
    });

    it('Get instance data, without private properties', function(done) {
      let clone = instance.get();
      assert.equal(true, typeof clone._config === 'undefined');
      done();
    });


    it('Get populated instance data', function(done) {
      instance.getPopulated({ stage: config.stage, region: config.region })
        .then(function(data) {
          assert.equal(true, JSON.stringify(data).indexOf('$${') == -1);
          assert.equal(true, JSON.stringify(data).indexOf('${') == -1);
          done();
        })
        .catch(e => {
          done(e);
        });
    });

    it('Set instance data', function(done) {
      let clone = instance.get();
      clone.project.name = 'newProject';
      instance.set(clone);
      assert.equal(true, instance.project.name === 'newProject');
      done();
    });

    it('Save instance to the file system', function(done) {
      instance.save()
        .then(function(instance) {
          done();
        })
        .catch(e => {
          done(e);
        });
    });

    it('Get stages', function(done) {
      let stages = instance.getStages();
      assert.equal(true, stages[0] === config.stage);
      done();
    });

    it('Get regions', function(done) {
      let regions = instance.getRegions(config.stage);
      assert.equal(true, regions[0] === config.region);
      done();
    });

    it('Get components w/o paths', function(done) {
      let components = instance.getComponents();
      assert.equal(true, components[0].name === 'nodejscomponent');
      done();
    });

    it('Get components w paths', function(done) {
      let components = instance.getComponents({ paths: ['nodejscomponent'] });
      assert.equal(true, components[0].name === 'nodejscomponent');
      done();
    });

    it('Get modules w/o paths', function(done) {
      let modules = instance.getModules();
      assert.equal(true, modules[0].name === 'module1');
      done();
    });

    it('Get modules w paths', function(done) {
      let modules = instance.getModules({ paths: ['nodejscomponent/module1'] });
      assert.equal(true, modules[0].name === 'module1');
      done();
    });

    it('Get functions w/o paths', function(done) {
      let functions = instance.getFunctions();
      assert.equal(true, functions.length === 3);
      done();
    });

    it('Get functions w paths', function(done) {
      let functions = instance.getFunctions({ paths: ['nodejscomponent/module1/function1'] });
      assert.equal(true, functions.length === 1);
      done();
    });

    it('Get endpoints w/o paths', function(done) {
      let endpoints = instance.getEndpoints();
      assert.equal(true, endpoints.length === 4);
      done();
    });

    it('Get endpoints w paths', function(done) {
      let endpoints = instance.getEndpoints({ paths: ['nodejscomponent/module1/function1@module1/function1~GET'] });
      assert.equal(true, endpoints.length === 1);
      done();
    });
  });
});
