/**
 * Created by Damindu on 5/17/2017.
 */

var usertest = require('../Controller/userController');
var mongoose = require('mongoose');
var expect = require('chai').expect;

describe('User Controller', function () {

    describe('Get Detail Of the User', function () {
        it('should return an array', function (done) {
            usertest.findDetails(function (data) {
                expect(data).to.be.a('array');
                done();
            })
        });
    });

    describe('Find User by requested email', function () {
        it('should return an array', function (done) {
            usertest.findUser(function (data) {
                expect(data).to.be.a('array');
                done();
            })
        });
    });
});
