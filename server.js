const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const db = require('knex')(configuration);
const jwt = require('jsonwebtoken');
require('dotenv').config();

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Potter DB';

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

const checkAuth = (request, response, next) => {
  const token = request.headers.authorization;

  if (!token) {
    response.status(403).json({message: 'You must be authorized to hit this endpoint'})
  } else {
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);

      next();
    } catch (error){
      response.status(403).json({message: 'Invalid token'})
    }
  }
};

const checkAdmin = (request, response, next) => {
  const token = request.headers.authorization;
  const decoded = jwt.verify(token, process.env.SECRET_KEY);

  if (decoded.admin) {
    next()
  } else {
    response.status(403).json({message: 'You must have admin privileges to hit this endpoint'})
  }
};

app.post('/authenticate', (request, response) => {
  const { email, appName } = request.body;
  const admin = email.includes('@turing.io') ? true : false;

  if (email && appName) {
    const token = jwt.sign({
      email, appName, admin
    }, process.env.SECRET_KEY, {expiresIn: '24h'})
    response.status(200).json({token: token})
  } else {
    response.status(404).json({message: 'Invalid authentication, must include valid email and app name'})
  }
});

app.get('/api/v1/houses', checkAuth, (request, response) => {
  db('houses').select()
    .then((houses) => {
      response.status(200).json(houses)
    })
    .catch(err => {
      response.status(500).json({error: err, message: 'Failed to GET houses'})
    })
});

app.get('/api/v1/houses/:id', checkAuth, (request, response) => {
  db('houses')
    .where('id', request.params.id)
    .select()
    .then(houses => {
      response.status(200).json(houses);
    })
    .catch(err => {
      response
        .status(404)
        .json({ error: err, message: 'House Not Found, Invalid Id' });
    });
});

app.post('/api/v1/houses', checkAuth, checkAdmin, (request, response) => {
  const house = request.body;

  if (!house.name 
    && !house.founder
    && !house.house_head 
    && !house.colors 
    && !house.ghost 
    && !house.common_room){
    return response.status(406).json({message: 'Invalid house supplied, valid house must have name, founder, house_head, colors, ghost, and common_room'})
  } else {
    db('houses').insert(house, 'id')
    .then(house => {
      response.status(201).json({id: house[0]})
    })
    .catch(err => {
      response.status(500).json({error: err, message: 'Failed to POST house. OOPPS!'})
    });
  }
});

app.put('/api/v1/houses/:id', checkAuth, checkAdmin, (request, response) => {
  db('houses').where('id', request.params.id).update({...request.body})
    .then(house => {
      response.status(200).json({message: 'House updated'})
    })
    .catch(err => {
      response.status(500).json({error: error, message: 'Failed to updata data'})
    })
});

app.delete('/api/v1/houses', checkAuth, checkAdmin, (request, response) => {
  const id = request.body.id;

  db('houses').where('id', id).del()
  .then(houses => {
    response.status(200).json({message: 'House deleted'})
  })
  .catch(err => {
    response.status(418).json({message: 'Unable to delete house'})
  });
});

app.get('/api/v1/characters', checkAuth, (request, response) => {
  const { house } = request.query;

  if (house) {
    db('characters').where('house', house).select()
      .then(characters => {
        if (characters.length > 0) {
        response.status(200).json(characters)
        } else {
          response.status(404).json({message: `No characters found in ${house} house`})
        }
      })
      .catch(error => {
        response.status(500).json({error: error, message: 'Error retrieving characters'})
      })
  } else {
    db('characters')
      .select()
      .then(characters => {
        response.status(200).json(characters);
      })
      .catch(err => {
        response
          .status(500)
          .json({ error: err, message: 'Failed to GET characters' });
      });
  }
});

app.get('/api/v1/characters/:id', checkAuth, (request, response) => {
  db('characters')
    .where('id', request.params.id)
    .select()
    .then(characters => {
      response.status(200).json(characters);
    })
    .catch(err => {
      response
        .status(500)
        .json({ error: err, message: 'Character Not Found, Invalid Id' });
    });
});

app.post('/api/v1/characters', checkAuth, checkAdmin, (request, response) => {
  const character = request.body;
  if (!character.name && !character.house_id){
    return response.status(406).json({message: 'Invalid character supplied, valid character must have name and house id'})
  } else {
    const newCharacter = {
      name: character.name,
      birthday: character.birthday || 'NA',
      patronus: character.patronus || 'NA',
      parents: character.parents || 'NA',
      skills: character.skills || 'NA',
      hobbies: character.hobbies || 'NA',
      blood: character.blood || 'NA',
      wand: character.wand || 'NA',
      image: character.image,
      house: character.house || 'NA',
      house_id: character.house_id
    }
    db('characters').insert(newCharacter, 'id')
    .then(characterId => {
      response.status(201).json({id: characterId[0]})
    })
    .catch(err => {
      response.status(500).json({error: err, message: 'Failed to POST character. OOPPS!'})
    });
  }
});

app.put('/api/v1/characters/:id', checkAuth, checkAdmin, (request, response) => {
  db('characters').where('id', request.params.id).update({...request.body})
    .then(character => {
      response.status(200).json({message: "Character Updated"})
    })
    .catch(error => {
      response.status(500).json({error: error, message: 'Unable to update character'})
    })
});

app.delete('/api/v1/characters', checkAuth, checkAdmin, (request, response) => {
  const id = request.body.id;
  db('characters').where('id', id).del()
    .then(characters => {
      response.status(200).json({message: 'Character removed'})
    })
    .catch(err => {
      response.status(404).json({message: "Character not found, unable to delete"})
    });
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = { app };