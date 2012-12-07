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
        cookie(),
        function (req, res) {
          res.setHeader('Content-Type', 'text/html');
          res.clearCookie('clearCookie', {path: '/admin'});
          res.cookie('hello', 'world');
          res.cookie('json', {foo: 1});
          res.end('hi');
        }
      );

      request(app)
      .get('/')
      .expect('Set-Cookie',
        'clearCookie=; Path=/admin; Expires=Thu, 01 Jan 1970 00:00:00 GMT,hello=world; Path=/,json=j%3A%7B%22foo%22%3A1%7D; Path=/')
      .expect(200, 'hi')
      .end(done);
    });

    it('should work with signed cookies', function (done) {
      var app = connect(
        connect.cookieParser('I\'m a secret.'),
        cookie(),
        function (req, res) {
          res.setHeader('Content-Type', 'text/html');
          res.cookie('json', {foo: 1}, {signed: true});
          res.end('hi');
        }
      );

      request(app)
      .get('/')
      .expect('hi')
      .expect(200, 'hi')
      .expect('Set-Cookie',
        'json=s%3Aj%3A%7B%22foo%22%3A1%7D.gCDmP%2BPgRlWz%2BON2WX%2Fb2gF1VZ6MIpKiW4oAXIJNRus; Path=/')
      .end(done);
    });

    it('should 500 error with signed cookies and not use cookieParser("secret")', function (done) {
      var app = connect(
        cookie(),
        function (req, res) {
          res.setHeader('Content-Type', 'text/html');
          res.cookie('json', {foo: 1}, {signed: true});
          res.end('hi');
        }
      );

      request(app)
      .get('/')
      .expect(500, /Error: connect\.cookieParser/)
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

    it('should work with options.maxAge', function (done) {
      var app = http.createServer(function (req, res) {
        cookie(res);
        res.setHeader('Content-Type', 'text/html');
        res.cookie('hello', 'world');
        res.cookie('json', {foo: 1}, {maxAge: 1000});
        res.end('hi');
      });

      request(app)
      .get('/')
      .expect('Set-Cookie', /Max\-Age=1000/)
      .expect(200, 'hi')
      .end(done);
    });
  });

});