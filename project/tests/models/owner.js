var chai = require('chai');
var expect = chai.expect; // we are using the "expect" style of Chai
var Owner = require('../../models/owner');

describe('Owner Model', function () {
    /*it('should get the Region list and have properties name, id', function () {
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
     });*/

    it('should get the Owner id on replace', function () {
        Owner.forceCreate("sudhir", "not yet", "WR",function (err, affectedRows) {
            console.log("affected rows after OWNER replace operation is " + affectedRows);
            expect(err).to.equal(null);
        });
    });
});