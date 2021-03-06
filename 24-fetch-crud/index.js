
// helper method to get random number for photos
const generateRandomNumber = (minNumber, maxNumber) => {
  // given a min and max, return a number between them
  return Math.floor((Math.random() * (maxNumber - minNumber) + minNumber) / 10) * 10;
}

const createComplimentHTML = (compliment) => {
  // debugger
  // let angeloParrotTag = '';
  // if (!compliment.favorited) {
  //   angeloParrotTag = `<img src="https://media.giphy.com/media/fxKZAR0nAUhJCcvqP5/giphy.gif" class="angelo-parrot" />`;
  // }
  return `<li>
    <div data-id="${compliment.id}" class="trash">🗑</div>
    <div class="favorite">⭐️</div>
    <img width="200" src="https://www.placecage.com/gif/${generateRandomNumber(400, 500)}/${generateRandomNumber(200, 250)}" />
    <h1>"${compliment.message}"</h1>
    <div>
      <cite data-id="${compliment.id}" data-hug-count="${compliment.hug_count}">Hugged ${compliment.hug_count} times</cite>
      <button>🤗 it</button>
    </div>
  </li>`;
}

const ulTag = document.querySelector('ul');

fetch('http://localhost:3000/compliments')
  .then(res => res.json())
  .then((compliments) => {
    compliments.forEach(compliment => {
      ulTag.innerHTML += createComplimentHTML(compliment)
    })
  })

// be able to add a "hug" to a compliment and see my hug count go up accordingly

// we need to find all of our buttons
ulTag.addEventListener('click', (event) => {
  if (event.target.tagName === 'BUTTON') {
    // we need to find the hug count element <cite> that we just clicked on
    const citeTag = event.target.parentElement.querySelector('cite');
    // we need to update it by 1
    let updatedHugCount = parseInt(citeTag.dataset.hugCount) + 1
    const complimentId = citeTag.dataset.id;

    updateComplimentHugCount(complimentId, updatedHugCount)
      .then(updatedCompliment => {
        citeTag.dataset.hugCount = updatedCompliment.hug_count;
        citeTag.innerText = `Hugged ${updatedCompliment.hug_count} times`;
      })

  } else if (event.target.classList.contains('trash')) {
    deleteCompliment(event.target.dataset.id)
      .then(() => {
        event.target.parentElement.remove();
      })
  } else if (event.target.classList.contains('favorite')) {
    event.target.parentElement.innerHTML =
    `<img src="https://media.giphy.com/media/fxKZAR0nAUhJCcvqP5/giphy.gif" class="angelo-parrot" />` +
    event.target.parentElement.innerHTML
  }
})


//  ----- to add my own compliments ------

// find our form
const formTag = document.querySelector('form')
// on submit, grab whatever is in the input box in the form (the compliment)
formTag.addEventListener('submit', function(event) {
  event.preventDefault()

  const compliment = event.target.compliment.value
  // using that compliment make a new compliment li, add in our compliment
  // attach that new li to our UL (in the top position)
  createNewCompliment(compliment)
    .then(parsedJSON => {
      ulTag.innerHTML = createComplimentHTML(parsedJSON) + ulTag.innerHTML
    })
})


const createNewCompliment = (compliment) => {
  return fetch('http://localhost:3000/compliments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      message: compliment,
      hug_count: 0,
      favorited: false
    })
  }).then(res => res.json())
}

const deleteCompliment = (id) => {
  return fetch(`http://localhost:3000/compliments/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  })
}

// update my hug count and have it save to my database
const updateComplimentHugCount = (id, hugCount) => {
// i need an id of the compliment i want to update
  return fetch(`http://localhost:3000/compliments/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    // i need the info i want updated ex. hug_count
    body: JSON.stringify({hug_count: hugCount})
  })
  .then(response => response.json())
}
