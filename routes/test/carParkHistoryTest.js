/**
 * Created by Damindu on 5/17/2017.
 */


var parkhistory = require('../Controller/carparkHistoryController');
var mongoose = require('mongoose');
var expect = require('chai').expect;

describe('Car Park History Controller', function () {

    describe('Connect with existing history', function () {
        it('should return array', function (done) {
            parkhistory.findHistory(function (data) {
                expect(data).to.be.a('array');
                done();
            })
        });
    });
});