var chai = require('chai');
var expect = chai.expect; // we are using the "expect" style of Chai
var Rldc = require('../../models/rldc');

describe('RLDC Model', function () {
    it('should get the Rldc list and have properties name, id', function () {
        Rldc.getAll(function (err, rows) {
            expect(err).to.equal(null);
            expect(rows.length).to.be.above(0);
            expect(rows[0]).to.have.property('name');
            expect(rows[0]).to.have.property('id');
            console.log("Number of RLDCs = " + rows.length);
            for (var i = 0; i < rows.length; i++) {
             console.log("name = " + rows[i].name + "\n");
             }
        });
    });
});