const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const { app, db } = require('../server');
const jwt = require('jsonwebtoken');
require('dotenv').config();

chai.use(chaiHttp);

describe('Api endpoints', () => {
  let token;
  let email = 'pat@askjeeves.com';
  let appName = 'Pats Bikes';
  let admin = true;

  beforeEach(done => {
    token = jwt.sign({
      email, appName, admin
    }, process.env.SECRET_KEY)
    db.migrate.rollback()
      .then(() => {
        db.migrate.latest()
          .then(() => {
            return db.seed.run()
              .then(() => {
                done();
              });
          });
      });
  });

  describe('POST /authenticate', () => {
    it('should return a jwt', (done) => {
      chai.request(app)
        .post('/authenticate')
        .send({
          email: 'Pat@askjeeves.com',
          appName: 'Pats Bikes'
        })
        .end((error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('object');
          response.body.should.have.property('token');
          done();
        });
    });

    it('should return an error if parameters are missing', (done) => {
      chai.request(app)
        .post('/authenticate')
        .send({
          email: 'Pat@askjeeves.com'
        })
        .end((error, response) => {
          response.should.be.json;
          response.should.have.status(404);
          response.body.should.be.an('object');
          response.body.should.have.property('message');
          response.body.message.should.equal('Invalid authentication, must include valid email and app name');
          done();
        });
    });
  });

  describe('GET /api/v1/houses', () => {
    it('should return houses', (done) => {
      chai.request(app)
        .get('/api/v1/houses')
        .set('authorization', token)
        .end((error, response) => {
          response.should.be.json;
          response.should.have.status(200);
          response.body.should.be.an('array');
          response.body[0].should.have.property('name')
          response.body[0].should.have.property('founder')
          response.body[0].should.have.property('house_head')
          response.body[0].should.have.property('colors')
          response.body[0].should.have.property('ghost')
          response.body[0].should.have.property('common_room');
          response.body[0].should.have.property('id');
          done();
        })
    })
  })
})