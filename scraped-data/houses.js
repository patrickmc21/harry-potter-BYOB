const Nightmare = require('nightmare');
const nightmare = Nightmare({show: true});
const fs = require('fs');

nightmare
  .goto('http://harrypotter.wikia.com/wiki/Hogwarts_Houses')
  .wait(1000)
  .evaluate(() => {
    let houseDivs = [...document.querySelectorAll('.pi-item.pi-data.pi-item-spacing.pi-border-color')]
    const houses = houseDivs.reduce((houseArr, currDiv) => {
      const key = currDiv.querySelector('.pi-data-label.pi-secondary-font').innerText;
      const items = currDiv.querySelectorAll('li');
      items.forEach((item, idx) => {
        if (idx < 4) {
          houseArr[idx][key] = item.innerText;
        } else {
          houseArr[3][key] = item.innerText;
        }
      })

      return houseArr;
    }, [{name: "Gryffindor"},{name: "Hufflepuff"},{name: "Ravenclaw"},{name: "Slytherin"}])
    return houses;
  })
  .end()
  .then((houses) => {
    let stringedHouses = JSON.stringify(houses, null, 2);

    fs.writeFile('./houses-data.json', stringedHouses, 'utf8', error => {
      if (error) {
        return console.log(error)
      }
    })
    console.log('Data saved to file')
  })
  .catch(err => {
    console.log(err)
  })