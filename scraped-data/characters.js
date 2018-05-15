const Nightmare = require('nightmare');
const nightmare = Nightmare({show: true});
let houseArray = [];
let charactersArray = [];
let characterInfoArray = [];


getHouseUrls()

function getHouseUrls() {
  nightmare
    .goto('https://www.pottermore.com/collection/characters')
    .evaluate(() => {
      const houseLinks = [...document.querySelectorAll('.artefact.artefact--tile.artefact--alternating')]
      return houseLinks.map(link => {
        return link.parentNode.href
      })
    })
    .end()
    .then(results => {
      for (let i = 0; i < 5; i++) {
        if (i !== 2) {
          houseArray.push(results[i])
        }
      }
      getCharacterUrls(charactersArray)
    })
    .catch(err => {
      console.log(err)
    })
}

function getCharacterUrls() {
  houseArray.forEach(house => {
    let nightmare = Nightmare({show: true})

    nightmare
      .goto(house)
      .evaluate(() => {
        const characterLinks = [...document.querySelectorAll('.artefact.artefact--tile.artefact--alternating')];

        return characterLinks.map(character => {
          return character.parentNode.href
        })
      })
      .end()
      .then((characters) => {
        charactersArray = [...charactersArray, ...characters];
        if (charactersArray.length === 76) {
          scrapeCharacters()
        }
      })
      .catch(error => {
        console.log(error)
      })
  })
}

function scrapeCharacters(){
  const shortArray = charactersArray.slice(0,40)
  const characterInfo = shortArray.map(link => {
    let nightmare = Nightmare({show: true})

    nightmare
      .goto(link)
      .wait(1000)
      .evaluate(() => {
        const keys = [...document.querySelectorAll('dt')];
        const stats = [...document.querySelectorAll('dd p')];
        
        const statObj = stats.reduce((statObj, stat, idx) => {
          statObj[keys[idx].innerText] = stat.innerText

          return statObj
        }, {})
        return statObj;
      })
      .end()
      .then((characterStats) => {
        console.log(characterStats)
      })
      .catch(error => {
        console.log(error)
      })
  })
}




// house selector '.artefact.artefact--tile.artefact--alternating'
// character selector '.div.artefact__content.artefact--tile__content.artefact--alternating__content'
// info selector '.l-widget--factfile.factfile.in-view'