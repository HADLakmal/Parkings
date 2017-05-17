/**
 * Created by Damindu on 5/17/2017.
 */

var reservetest = require('../Controller/reserveController');
var mongoose = require('mongoose');
var expect = require('chai').expect;

describe('Reservation Controller', function () {

    describe('Get number of reservations', function () {
        it('should return number', function (done) {
            reservetest.findAll(function (data) {
                expect(data).not.to.be.NaN;
                done();
            })
        });
    });

    describe('Get all reservation details ', function () {
        it('should return an array', function (done) {
            reservetest.allReserves(function (data) {
                expect(data).to.be.a('array');
                done();
            })
        });
    });
});