const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const { app, db } = require('../server');
const jwt = require('jsonwebtoken');
require('dotenv').config();

chai.use(chaiHttp);

describe('client routes', () => {
  it('should return the homepage', (done) => {
    chai.request(app)
      .get('/')
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.html;
        done();
      });
  });

  it('should return 404 for a route that does not exist', (done) => {
    chai.request(app)
      .get('/bottle')
      .end((error, response) => {
        response.should.status(404);
        done();
      });
  });
});

describe('Api endpoints', () => {
  let token;
  let email = 'pat@askjeeves.com';
  let appName = 'Pats Bikes';
  let admin = true;

  beforeEach(done => {
    token = jwt.sign({
      email, appName, admin
    }, process.env.SECRET_KEY);
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
          /* eslint-disable max-len*/
          response.body.message.should.equal('Invalid authentication, must include valid email and app name');
          /* eslint-enable max-len*/
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
          response.body[0].should.have.property('name');
          response.body[0].should.have.property('founder');
          response.body[0].should.have.property('house_head');
          response.body[0].should.have.property('colors');
          response.body[0].should.have.property('ghost');
          response.body[0].should.have.property('common_room');
          response.body[0].should.have.property('id');
          done();
        });
    });
  });

  describe('GET /api/v1/houses/:id', () => {
    it('should return a specific house', (done) => {
      chai.request(app)
        .get('/api/v1/houses/3')
        .set('authorization', token)
        .end((error, response) => {
          response.should.be.json;
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.should.have.property('name');
          response.body.should.have.property('founder');
          response.body.should.have.property('house_head');
          response.body.should.have.property('colors');
          response.body.should.have.property('ghost');
          response.body.should.have.property('common_room');
          response.body.should.have.property('id');
          done();
        });
    });

    it('should return house not found if house does not exist', (done) => {
      chai
        .request(app)
        .get('/api/v1/houses/5')
        .set('authorization', token)
        .end((error, response) => {
          response.should.be.json;
          response.should.have.status(404);
          response.body.should.have.property('message');
          response.body.message.should.equal('House Not Found');
          done();
        });
    });

    it('should return an error if id is invalid', (done) => {
      chai
        .request(app)
        .get('/api/v1/houses/hello')
        .set('authorization', token)
        .end((error, response) => {
          response.should.be.json;
          response.should.have.status(404);
          response.body.should.have.property('message');
          response.body.should.have.property('error');
          response.body.message.should.equal('Invalid Id');
          done();
        });
    });
  });

  describe('POST /api/v1/houses', () => {
    it('should return id if post is successful', done => {
      chai
        .request(app)
        .post('/api/v1/houses')
        .set('authorization', token)
        .send({
          name: 'Potter House',
          founder: 'Harry Potter',
          house_head: 'Harry Potter',
          colors: 'gold and silver',
          ghost: 'Dumbledore',
          common_room: 'The Room of Requirement'
        })
        .end((error, response) => {
          response.should.be.json;
          response.should.have.status(201);
          response.body.should.be.an('object');
          response.body.should.have.property('id');
          response.body.id.should.equal(5);
          done();
        });
    });

    it('should return error if invalid body supplied', done => {
      chai
        .request(app)
        .post('/api/v1/houses')
        .set('authorization', token)
        .send({
          founder: 'Harry Potter',
          house_head: 'Harry Potter',
          colors: 'gold and silver',
          ghost: 'Dumbledore',
          common_room: 'The Room of Requirement'
        })
        .end((error, response) => {
          response.should.be.json;
          response.should.have.status(406);
          response.body.should.be.an('object');
          response.body.should.have.property('message');
          /* eslint-disable max-len*/
          response.body.message.should.equal('Invalid house supplied, valid house must have name, founder, house_head, colors, ghost, and common_room');
          /* eslint-enable max-len*/
          done();
        });
    });
  });

  describe('PUT /api/v1/houses/:id', () => {
    it('should update a house', done => {
      chai
        .request(app)
        .put('/api/v1/houses/1')
        .set('authorization', token)
        .send({
          name: 'Gryffindor',
          founder: 'Harry Potter',
          house_head: 'Harry Potter',
          colors: 'gold and silver',
          ghost: 'Dumbledore',
          common_room: 'The Room of Requirement'
        })
        .end((error, response) => {
          response.should.be.json;
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.should.have.property('message');
          response.body.message.should.equal('House updated');
          done();
        });
    });
    /* eslint-disable max-len*/
    it('should return an error if invalid Id provided when updating houses', done => {
      /* eslint-enable max-len*/
      chai
        .request(app)
        .put('/api/v1/houses/hello')
        .set('authorization', token)
        .send({
          name: 'Gryffindor',
          founder: 'Harry Potter',
          house_head: 'Harry Potter',
          colors: 'gold and silver',
          ghost: 'Dumbledore',
          common_room: 'The Room of Requirement'
        })
        .end((error, response) => {
          response.should.be.json;
          response.should.have.status(500);
          response.body.should.be.an('object');
          response.body.should.have.property('message');
          response.body.should.have.property('error');
          response.body.message.should.equal('Failed to update data');
          done();
        });
    });
  });

  describe('DELETE /api/v1/houses', () => {
    it('should delete a house', (done) => {
      chai.request(app)
        .delete('/api/v1/houses')
        .set('authorization', token)
        .send({id: 1})
        .end((error, response) => {
          response.should.be.json;
          response.should.have.status(200);
          response.body.should.have.property('message');
          response.body.message.should.equal('House deleted');
          done();
        });
    });

    it('should return an error if unable to delete house', (done) => {
      chai.request(app)
        .delete('/api/v1/houses')
        .set('authorization', token)
        .send({id: 'none'})
        .end((error, response) => {
          response.should.be.json;
          response.should.have.status(418);
          response.body.should.have.property('message');
          response.body.message.should.equal('Unable to delete house');
          done();
        });
    });
  });

  describe('GET /api/v1/characters', () => {
    it('should return characters', (done) => {
      chai.request(app)
        .get('/api/v1/characters')
        .set('authorization', token)
        .end((error, response) => {
          response.should.be.json;
          response.should.have.status(200);
          response.body.should.be.an('array');
          response.body[0].should.have.property('name');
          response.body[0].should.have.property('birthday');
          response.body[0].should.have.property('patronus');
          response.body[0].should.have.property('parents');
          response.body[0].should.have.property('skills');
          response.body[0].should.have.property('hobbies');
          response.body[0].should.have.property('blood');
          response.body[0].should.have.property('wand');
          response.body[0].should.have.property('image');
          response.body[0].should.have.property('house');
          response.body[0].should.have.property('house_id');
          response.body[0].should.have.property('id');         
          done();
        });
    });

    it('should return characters by house if queried', (done) => {
      chai.request(app)
        .get('/api/v1/characters?house=Ravenclaw')
        .set('authorization', token)
        .end((error, response) => {
          response.should.be.json;
          response.should.have.status(200);
          response.body.should.be.an('array');
          response.body[0].should.have.property('name');
          response.body[0].should.have.property('birthday');
          response.body[0].should.have.property('patronus');
          response.body[0].should.have.property('parents');
          response.body[0].should.have.property('skills');
          response.body[0].should.have.property('hobbies');
          response.body[0].should.have.property('blood');
          response.body[0].should.have.property('wand');
          response.body[0].should.have.property('image');
          response.body[0].should.have.property('house');
          response.body[0].should.have.property('house_id');
          response.body[0].should.have.property('id');
          done();
        });
    });

    it('should return an error if queried not found', (done) => {
      chai.request(app)
        .get('/api/v1/characters?house=hello')
        .set('authorization', token)
        .end((error, response) => {
          response.should.be.json;
          response.should.have.status(404);
          response.body.should.be.an('object');
          response.body.should.have.property('message');
          /* eslint-disable max-len*/
          response.body.message.should.equal('No characters found in hello house');
          /* eslint-enable max-len*/
          done();
        });
    });
  });

  describe('GET /api/v1/characters/:id', () => {
    it('should return a specific character', (done) => {
      chai.request(app)
        .get('/api/v1/characters/4')
        .set('authorization', token)
        .end((error, response) => {
          response.should.be.json;
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.should.have.property('name');
          response.body.should.have.property('birthday');
          response.body.should.have.property('patronus');
          response.body.should.have.property('parents');
          response.body.should.have.property('skills');
          response.body.should.have.property('hobbies');
          response.body.should.have.property('blood');
          response.body.should.have.property('wand');
          response.body.should.have.property('image');
          response.body.should.have.property('house');
          response.body.should.have.property('house_id');
          response.body.should.have.property('id');         
          done();
        });
    });

    it('should return error not found if character does not exist', (done) => {
      chai
        .request(app)
        .get('/api/v1/characters/38')
        .set('authorization', token)
        .end((error, response) => {
          response.should.be.json;
          response.should.have.status(404);
          response.body.should.have.property('message');
          response.body.message.should.equal('Character Not Found');
          done();
        });
    });

    it('should return an error if id is invalid', (done) => {
      chai
        .request(app)
        .get('/api/v1/characters/hello')
        .set('authorization', token)
        .end((error, response) => {
          response.should.be.json;
          response.should.have.status(500);
          response.body.should.have.property('message');
          response.body.should.have.property('error');
          response.body.message.should.equal('Invalid Id');
          done();
        });
    });
  });

  describe('POST /api/v1/characters', () => {
    it('should return id if post is successful', done => {
      chai
        .request(app)
        .post('/api/v1/characters')
        .set('authorization', token)
        .send({
          name: 'Pat',
          birthday: '1/1/1990',
          patronus: 'Wolf',
          parents: 'Dad and Mom',
          skills: 'drinking',
          hobbies: 'drinking',
          blood: 'O Neg',
          wand: 'liger',
          image: 'pat image',
          house: 'Gryffindor',
          house_id: 1
        })
        .end((error, response) => {
          response.should.be.json;
          response.should.have.status(201);
          response.body.should.be.an('object');
          response.body.should.have.property('id');
          response.body.id.should.equal(38);
          done();
        });
    });

    it('should return error if invalid body supplied', done => {
      chai
        .request(app)
        .post('/api/v1/characters')
        .set('authorization', token)
        .send({
          birthday: '1/1/1990',
          patronus: 'Wolf',
          parents: 'Dad and Mom',
          skills: 'drinking',
          hobbies: 'drinking',
          blood: 'O Neg',
          wand: 'liger',
          image: 'pat image',
          house: 'Gryffindor',
          house_id: 1
        })
        .end((error, response) => {
          response.should.be.json;
          response.should.have.status(406);
          response.body.should.be.an('object');
          response.body.should.have.property('message');
          /* eslint-disable max-len*/
          response.body.message.should.equal('Invalid character supplied, valid character must have name and house id');
          /* eslint-enable max-len*/
          done();
        });
    });
  });

  describe('PUT /api/v1/characters/:id', () => {
    it('should update a character', done => {
      chai
        .request(app)
        .put('/api/v1/characters/1')
        .set('authorization', token)
        .send({
          name: 'Pat',
          birthday: '1/1/1990',
          patronus: 'Wolf',
          parents: 'Dad and Mom',
          skills: 'drinking',
          hobbies: 'drinking',
          blood: 'O Neg',
          wand: 'liger',
          image: 'pat image',
          house: 'Gryffindor',
          house_id: 1
        })
        .end((error, response) => {
          response.should.be.json;
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.should.have.property('message');
          response.body.message.should.equal('Character Updated');
          done();
        });
    });
    /* eslint-disable max-len*/
    it('should return an error if invalid Id provided when updating character', done => {
      /* eslint-enable max-len*/
      chai
        .request(app)
        .put('/api/v1/characters/hello')
        .set('authorization', token)
        .send({
          name: 'Pat',
          birthday: '1/1/1990',
          patronus: 'Wolf',
          parents: 'Dad and Mom',
          skills: 'drinking',
          hobbies: 'drinking',
          blood: 'O Neg',
          wand: 'liger',
          image: 'pat image',
          house: 'Gryffindor',
          house_id: 1
        })
        .end((error, response) => {
          response.should.be.json;
          response.should.have.status(500);
          response.body.should.be.an('object');
          response.body.should.have.property('message');
          response.body.should.have.property('error');
          response.body.message.should.equal('Unable to update character');
          done();
        });
    });
  });

  describe('DELETE /api/v1/characters', () => {
    it('should delete a character', (done) => {
      chai.request(app)
        .delete('/api/v1/characters')
        .set('authorization', token)
        .send({id: 1})
        .end((error, response) => {
          response.should.be.json;
          response.should.have.status(200);
          response.body.should.have.property('message');
          response.body.message.should.equal('Character removed');
          done();
        });
    });

    it('should return an error if unable to delete character', done => {
      chai
        .request(app)
        .delete('/api/v1/characters')
        .set('authorization', token)
        .send({ id: 'none' })
        .end((error, response) => {
          response.should.be.json;
          response.should.have.status(404);
          response.body.should.have.property('message');
          /* eslint-disable max-len*/
          response.body.message.should.equal('Character not found, unable to delete');
          /* eslint-enable max-len*/
          done();
        });
    });
  });
});