var chai = require('chai');
var expect = chai.expect; // we are using the "expect" style of Chai
var Entity = require('../../models/entity');

describe('Entity Model', function () {
    it('should get the Entity list and have properties name, id, region_id', function () {
        Entity.getAll(function (err, rows) {
            expect(err).to.equal(null);
            expect(rows.length).to.be.above(0);
            expect(rows[0]).to.have.property('name');
            expect(rows[0]).to.have.property('id');
            expect(rows[0]).to.have.property('region_id');
            console.log("Number of entities = " + rows.length);
            for (var i = 0; i < rows.length; i++) {
                console.log("name = " + rows[i].name + ";region_id = " + rows[i].region_id + "\n");
            }
        });
    });
});