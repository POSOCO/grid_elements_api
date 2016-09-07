var chai = require('chai');
var expect = chai.expect; // we are using the "expect" style of Chai
var Region = require('../../models/region');

describe('Region Model', function () {
    it('should get the Region list and have properties name, id', function () {
        Region.getAll(function (err, rows) {
            expect(err).to.equal(null);
            expect(rows.length).to.be.above(0);
            expect(rows[0]).to.have.property('name');
            expect(rows[0]).to.have.property('id');
            console.log("Number of regions = " + rows.length);
            for (var i = 0; i < rows.length; i++) {
                console.log("name = " + rows[i].name + "\n");
            }
        });
    });

    it('should get the Region id on replace', function () {
        Region.replace("WR",function (err, affectedRows) {
            console.log("inserted id after replace operation is " + insertId);
            expect(err).to.equal(null);
            expect(affectedRows).to.equal(1);
        });
    });
});