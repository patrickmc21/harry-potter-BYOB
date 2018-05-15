const houses = require('../../../scraped-data/houses-data.json');
const characters = require('../../../scraped-data/characters-data.json');

houses.forEach(house => {
  house.members = characters.filter(character => character.HOUSE === house.name)
})

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
    })
    return Promise.all(characterPromises)
  })
}

const createCharacter = (knex, character) => {
  return knex('characters').insert(character)
}

exports.seed = function(knex, Promise) {
  return knex('characters').del()
    .then(function() {
      knex('houses').del()
    })
    .then(function() {
      let housePromises = [];

      houses.forEach(house => {
        housePromises.push(createHouse(knex, house))
      })
      return Promise.all(housePromises)
    })
  .catch(err => {
    console.log(err)
  })
}





// exports.seed = function(knex, Promise) {
//   return knex('houses').del()
//     .then(function () {
//       return knex('houses').insert([
//         {
//           name: houses[0].name,
//           founder: houses[0].Founder,
//           house_head: houses[0].Head,
//           colors: houses[0]['House colours'],
//           ghost: houses[0].Ghost,
//           common_room: houses[0]['Common room']
//         },
//         {
//           name: houses[1].name,
//           founder: houses[1].Founder,
//           house_head: houses[1].Head,
//           colors: houses[1]['House colours'],
//           ghost: houses[1].Ghost,
//           common_room: houses[1]['Common room']
//         },
//         {
//           name: houses[2].name,
//           founder: houses[2].Founder,
//           house_head: houses[2].Head,
//           colors: houses[2]['House colours'],
//           ghost: houses[2].Ghost,
//           common_room: houses[2]['Common room']
//         },
//         {
//           name: houses[3].name,
//           founder: houses[3].Founder,
//           house_head: houses[3].Head,
//           colors: houses[3]['House colours'],
//           ghost: houses[3].Ghost,
//           common_room: houses[3]['Common room']
//         }
//       ]);
//     })
//     .catch(err => {
//       console.log(err)
//     })
//   .catch(err => {
//     console.log(err)
//   })
// };

// //////////////////////////



// exports.seed = (knex, Promise) => {
//   return knex('characters').del()
//     .then(function () {
//       let characterPromises = [];

//       characters.forEach(character => characterPromises.push(createCharacter(knex, character)));
//       return Promise.all(characterPromises);
//     })
//   .catch(err => {
//     console.log(err)
//   })
// }

// function createCharacter (knex, character) {
//   console.log('djfr', character)
//   let house_id;

//   switch (character.HOUSE) {
//     case 'Gryffindor':
//       house_id = 1
//       break
//     case 'Hufflepuff':
//       house_id = 2
//       break
//     case 'Ravenclaw':
//       house_id = 3
//       break
//     case 'Slytherin':
//       house_id = 4
//       break
//     default: house_id = 1
//   }

//   console.log('id', id)

//     return knex('characters').del()
//       .then(function () {
//         return knex('characters').insert([
//           {
//             name: character.NAME,
//             birthday: character.BIRTHDAY || 'NA',
//             patronus: character.PATRONUS || 'NA',
//             parents: character.PARENTS || 'NA',
//             skills: character.SKILLS || 'NA',
//             hobbies: character.HOBBIES || 'NA',
//             blood: 'NA',
//             wand: character.WAND || 'NA',
//             image: character.IMAGE,
//             house: character.HOUSE || 'NA',
//             house_id: id
//           }
//         ]);
//       })
//     .catch(err => {
//       console.log(err)
//     })
//   .catch(err => {
//     console.log(err)
//   })
// };
