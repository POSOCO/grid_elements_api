var chai = require('chai');
var expect = chai.expect; // we are using the "expect" style of Chai
var Associate = require('../../models/associate');

describe('Associate Model', function () {
    it('should get the Associates list and have properties id, element_id, entity_id', function () {
        Associate.getAll(function (err, rows) {
            expect(err).to.equal(null);
            expect(rows.length).to.be.above(0);
            expect(rows[0]).to.have.property('id');
            expect(rows[0]).to.have.property('element_id');
            expect(rows[0]).to.have.property('entity_id');
            console.log("Number of Associates = " + rows.length);
            for (var i = 0; i < rows.length; i++) {
                console.log("id = " + rows[i].id + "; element_id = " + rows[i].element_id + "; entity_id = " + rows[i].entity_id + "\n");
            }
        });
    });
    
    it('should get the Associates list for a particular element_id 1 and have properties id, element_id, entity_id', function () {
        Associate.getByElement(1, function (err, rows) {
            expect(err).to.equal(null);
            expect(rows.length).to.be.above(0);
            expect(rows[0]).to.have.property('id');
            expect(rows[0]).to.have.property('element_id');
            expect(rows[0]).to.have.property('entity_id');
            console.log("Number of Associates for element_id 1 = " + rows.length);
            for (var i = 0; i < rows.length; i++) {
                console.log("id = " + rows[i].id + "; element_id = " + rows[i].element_id + "; entity_id = " + rows[i].entity_id + " for element_id = 1\n");
            }
        });
    });
});
