var chai = require('chai');
var chaiHttp = require('chai-http');

global.environment = 'test';
var server = require('../server.js');
var Item = require('../models/item');
var seed = require('../db/seed');

var should = chai.should();
var expect = chai.expect;
var app = server.app;

chai.use(chaiHttp);

describe('Shopping List', function() {
    before(function(done) {
        seed.run(function() {
            done();
        });
    });


    it('should list items on get', function(done) {
        chai.request(app)
            .get('/items')
            .end(function (err, res) {
                should.equal(err, null);
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body.should.have.length(3);
                res.body[0].should.be.a('object');
                res.body[0].should.have.property('_id');
                res.body[0].should.have.property('name');
                res.body[0]['_id'].should.be.a('string');
                res.body[0].name.should.be.a('string');
                res.body[0].name.should.equal('Broad beans');
                res.body[1].name.should.equal('Tomatoes');
                res.body[2].name.should.equal('Peppers');
                done();
            });
    });

    it('should add an item on POST', function(done) {
        chai.request(app)
            .post('/items')
            .send({'name': 'Kale'})
            .end(function(err, res) {

                should.equal(err, null);
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('name');
                res.body.should.have.property('_id');
                res.body.name.should.be.a('string');
                res.body['_id'].should.be.a('string');
                res.body.name.should.equal('Kale');
                Item.find(function(err, items){
                    //console.log(items.length);
                    items.should.have.length(4);
                    items.should.be.a('array');
                    items[3].should.be.a('object');
                    items[3].should.have.property('_id');
                    items[3].should.have.property('name');
                    items[3].name.should.be.a('string');
                    items[3].name.should.equal('Kale');
                });
                done();
            });
    });

    it('should edit an item on put', function(done){

        Item.find({'name': 'Tomatoes'}, function(err, item){
            //console.log('Tomatoes object = ', item);
            var id = item[0]['_id'];
            //console.log('id = ', id);

            chai.request(app)
                .put('/items/' + id)
                .send({'name': 'tom'})
                .end(function(err, res){
                    expect(res).have.status(200);
                    Item.find({'_id': id}, function(err, res){
                        //console.log(res);
                        done();
                    });
                });
        });

    });

    it('should send a 204 when trying to update an id that does not exist', function(done) {

        chai.request(app)
            .put('/items/25')
            .send({'name': 'hello world'})
            .end(function (err, res) {
                //console.log('err = ', err);
                //console.log('res = ', res);
                expect(res).have.status(204);
                done();
            });

    });


    after(function(done) {
        Item.remove(function() {
            done();
        });
    });
});