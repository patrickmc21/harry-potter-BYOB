const houses = require('../../../scraped-data/houses-data.json');
const characters = require('../../../scraped-data/characters-data.json');

houses.forEach(house => {
  house.members = characters.filter(character => character.HOUSE === house.name);
});

const createHouse = (knex, house) => {
  return knex('houses').insert({
    name: house.name,
    founder: house.Founder,
    house_head: house.Head,
    colors: house['House colours'],
    ghost: house.Ghost,
    common_room: house['Common room']
  }, 'id')
    .then(function(houseId) {
      let characterPromises = [];

      house.members.forEach(member => {
        characterPromises.push(createCharacter(knex, {
          name: member.NAME,
          birthday: member.BIRTHDAY || 'NA',
          patronus: member.PATRONUS || 'NA',
          parents: member.PARENTS || 'NA',
          skills: member.SKILLS || 'NA',
          hobbies: member.HOBBIES || 'NA',
          blood: 'NA',
          wand: member.WAND || 'NA',
          image: member.IMAGE,
          house: member.HOUSE || 'NA',
          house_id: houseId[0]
        }));
      });
      return Promise.all(characterPromises);
    });
};

const createCharacter = (knex, character) => {
  return knex('characters').insert(character);
};

exports.seed = function(knex, Promise) {
  return knex('characters').del()
    .then(function() {
      knex('houses').del();
    })
    .then(function() {
      let housePromises = [];

      houses.forEach(house => {
        housePromises.push(createHouse(knex, house));
      });
      return Promise.all(housePromises);
    })
    .catch(error => {
      console.log(error);
    });
};