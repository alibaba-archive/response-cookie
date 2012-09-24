/*!
 * response-cookie - test/cookie.js
 * Copyright(c) 2012 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

"use strict";

/**
 * Module dependencies.
 */

var cookie = require('../');
var connect = require('connect');
var request = require('supertest');
var http = require('http');

describe('cookie.js', function () {

  describe('use with connect', function () {
    it('should work', function (done) {
      var app = connect(
        function (req, res, next) {
          cookie(res);
          next();
        },
        function (req, res) {
          res.setHeader('Content-Type', 'text/html');
          res.cookie('hello', 'world');
          res.cookie('json', {foo: 1});
          res.end('hi');
        }
      );

      request(app)
      .get('/')
      .expect('Set-Cookie', 'hello=world; Path=/,json=j%3A%7B%22foo%22%3A1%7D; Path=/')
      .expect(200, 'hi')
      .end(done);
    });
  });

  describe('use with http', function () {
    it('should work', function (done) {
      var app = http.createServer(function (req, res) {
        cookie(res);
        res.setHeader('Content-Type', 'text/html');
        res.cookie('hello', 'world');
        res.cookie('json', {foo: 1});
        res.end('hi');
      });

      request(app)
      .get('/')
      .expect('Set-Cookie', 'hello=world; Path=/,json=j%3A%7B%22foo%22%3A1%7D; Path=/')
      .expect(200, 'hi')
      .end(done);
    });
  });

});