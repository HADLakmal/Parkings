/**
 * Created by Damindu on 5/17/2017.
 */

var carparktest = require('../Controller/carparkControl');
var mongoose = require('mongoose');
var expect = require('chai').expect;

describe('Car Park Controller', function () {

    describe('Login user using username and password', function () {
        it('should return an array', function () {
            carparktest.findUser(function (data) {
                expect(data).to.be.a('array');
                // done();
            })
        });
    });

    describe('Get Detail Of the User', function () {
        it('should return an array', function () {
            carparktest.findDetail(function (data) {
                expect(data).to.be.a('array');
                // done();
            })
        });
    });
    describe('Get the prices using id', function () {
        it('should return an array', function () {
            carparktest.findPrice(function (data) {
                expect(data).to.be.a('array');
                // done();
            })
        });
    });

    describe('Whole details for view car details', function () {
        it('should return an array', function () {
            carparktest.findView(function (data) {
                expect(data).to.be.a('array');
                // done();
            })
        });
    });

});