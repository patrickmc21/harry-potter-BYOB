const Nightmare = require('nightmare');
const nightmare = Nightmare({show: true});
const fs = require('fs');
let houseArray = [];
let charactersArray = [];
let characterInfoArray = [];


getHouseUrls()

function getHouseUrls() {
  nightmare
    .goto('https://www.pottermore.com/collection/characters')
    .evaluate(() => {
      const houseLinks = [
        ...document.querySelectorAll(
          '.artefact.artefact--tile.artefact--alternating'
        )
      ];
      return houseLinks.map(link => {
        return link.parentNode.href;
      });
    })
    .end()
    .then(results => {
      for (let i = 0; i < 5; i++) {
        if (i !== 2) {
          houseArray.push(results[i]);
        }
      }
      getCharacterUrls(charactersArray);
    })
    .catch(err => {
      console.log(err);
    });
}

function getCharacterUrls() {
  houseArray.forEach(house => {
    let nightmare = Nightmare({ show: true });

    nightmare
      .goto(house)
      .evaluate(() => {
        const characterLinks = [
          ...document.querySelectorAll(
            '.artefact.artefact--tile.artefact--alternating'
          )
        ];

        return characterLinks.map(character => {
          return character.parentNode.href;
        });
      })
      .end()
      .then(characters => {
        charactersArray = [...charactersArray, ...characters];
        if (charactersArray.length === 76) {
          scrapeCharacters(characterInfoArray);
        }
      })
      .catch(error => {
        console.log(error);
      });
  });
}

function scrapeCharacters() {
  const shortArray = charactersArray.slice(0, 40);
  const characterInfo = shortArray.map(link => {
    let nightmare = Nightmare({ show: true });

    nightmare
      .goto(link)
      .wait(1000)
      .evaluate(() => {
        const keys = [...document.querySelectorAll('dt')];
        const stats = [...document.querySelectorAll('dd p')];
        const image = document.querySelector('img').src;
        const nameTitle = document.querySelector('.factfile__title').innerText;
        const splitTitle = nameTitle.split(' ');
        const name = splitTitle[0] + ' ' + splitTitle[1];

        const statObj = stats.reduce((statObj, stat, idx) => {
          statObj.IMAGE = image;
          statObj.NAME = name;
          statObj[keys[idx].innerText] = stat.innerText;

          return statObj;
        }, {});
        return statObj;
      })
      .end()
      .then(characterStats => {
        characterInfoArray = [...characterInfoArray, characterStats];
        if (characterInfoArray.length === 40) {
          let stringedCharactersInfo = JSON.stringify(characterInfoArray, null, 2);

          fs.writeFile('./characters-data.json', stringedCharactersInfo, 'utf8',
            error => {
              if (error) {
                return console.log(error);
              }
            }
          );
        }
        console.log(characterInfoArray.length);
      })
      .catch(error => {
        console.log(error);
      });
  });
}
