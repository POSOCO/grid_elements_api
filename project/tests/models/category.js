var chai = require('chai');
var expect = chai.expect; // we are using the "expect" style of Chai
var Category = require('../../models/category');

describe('Category Model', function () {
    it('should get the Category list and have properties name, id', function () {
        Category.getAll(function (err, rows) {
            expect(err).to.equal(null);
            expect(rows.length).to.be.above(0);
            expect(rows[0]).to.have.property('name');
            expect(rows[0]).to.have.property('id');
            console.log("Number of categories = " + rows.length);
            /*for (var i = 0; i < rows.length; i++) {
                console.log("name = " + rows[i].name + "\n");
            }*/
        });
    });
});