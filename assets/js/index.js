const key = 'ffe39d279ee0a46d632ff7b9e7ac02b5';
const token = '14edac06db12fc2ad32ab72d715ec5d841ee402c02a19e7dc162d6c265a1da6d'
const boardId = '5e85acba78a12f3e5a028ba7';
const listId = '5e85ad2f4e862e4caf13bc81';

//create event for addButton
var mainButton = document.querySelector('.addButton');
mainButton.addEventListener('click', openInputDiv);

//function for open inputDiv
function openInputDiv(event) {
  event.target.parentElement.style.display = 'none';
  document.querySelector('.hideDiv').style.display = 'block';
}

//create event for add card
var addButton = document.querySelector('.hideButton');
addButton.addEventListener('click', addNewCard);

//function for create and post new card
function addNewCard(event) {
  var cardName = document.querySelector('.input').value;
//   console.log(cardName);
  if (cardName !== '') {
    const data = fetch(`https://api.trello.com/1/cards?name=${cardName}&idList=${listId}&keepFromSource=all&key=${key}&token=${token}`,{
        method: 'POST'
      })
      .then(data => data.json())
      .then(data => {
        var cardTitle = document.createElement('div');
        cardTitle.classList.add('card')
        cardTitle.innerHTML = `<div class = "card-body d-flex justify-content-between" cardId ="${data.id}"
        cardName ="${data.name}">${cardName}<button class="deleteButton btn btn-danger btn-xsm">x</button></div>`
        var allCards = document.querySelector('.allCards');
        allCards.appendChild(cardTitle);
        cardName = '';
      });
  }
}

//close input block
var hideButton1 = document.querySelector('.hideButton1');
hideButton1.addEventListener('click', closeInputBlock);

//function for close inputDiv
function closeInputBlock(event) {
  var inputItem = document.querySelector('.input');
  event.target.parentElement.parentElement.style.display = 'none';
  // document.querySelector('.hideDiv').style.display = 'none';
  document.querySelector('.addButton').parentElement.style.display = 'block';
  inputItem.value = '';
}

//Get all cards from trello dataBase and display
function getAllCard() {
  fetch(
    `https://api.trello.com/1/lists/${listId}/cards?key=${key}&token=${token}`,
    {
      method: 'GET'
    }
  )
    .then(data => data.json())
    // .then(data => console.log(data));
    .then(data =>
      data.forEach(element => {
        var cardTitle = document.createElement('div');
        cardTitle.classList = 'card';
        cardTitle.innerHTML = `<div class = "card-body d-flex justify-content-between" cardId ="${element.id}"
        cardName ="${element.name}">${element.name}<button class="deleteButton btn btn-danger btn-xsm">x</button></div>`
        var allCards = document.querySelector('.allCards');
        allCards.appendChild(cardTitle);
      })
    );
}
getAllCard();

//create event for delete Button
var cardList = document.querySelector('.allCards');
cardList.addEventListener('click', deleteCard);

//function for delete card
function deleteCard(event) {
  if (event.target.classList.value === 'deleteButton btn btn-danger btn-xsm') {
    var cardId = event.target.parentElement.getAttribute(
      'cardId'
    );
    console.log(cardId)
    fetch(
      `https://api.trello.com/1/cards/${cardId}?key=${key}&token=${token}`,
      {
        method: 'DELETE'
      }
    ).then(
      () => (event.target.parentElement.parentElement.style.display = 'none')
    );
    event.stopPropagation();
  }
}
