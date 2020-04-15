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
var addButton = document.querySelector('.addcardButton');
addButton.addEventListener('click', addNewCard);

//function for create and post new card
function addNewCard(event) {
  var cardName = document.querySelector('.input');
  console.log(cardName.value);
  if (cardName.value !== '') {
    fetch(`https://api.trello.com/1/cards?name=${cardName.value}&idList=${listId}&keepFromSource=all&key=${key}&token=${token}`, {
      method: 'POST'
    }).then(data => {
      data.json()
        .then(data => {
          addcardtoDom(data)
        })
    })
      .catch(error => {
        console.log(error)
      })
  }
}

function addcardtoDom(card) {
  var cardTitle = document.createElement('div');
  cardTitle.classList = 'card';
  cardTitle.style.display = 'flex'
  cardTitle.style.flexDirection = 'row'
  cardTitle.style.justifyContent = 'space-between'
  cardTitle.style.padding = '10px'
  cardTitle.setAttribute('data-toggle', 'modal'); //it is use for open modal with respective card
  cardTitle.setAttribute('data-target', `#${card.id}`);
  cardTitle.setAttribute('cardId', card.id);
  cardTitle.setAttribute('cardName', card.name);
  cardTitle.innerHTML =
    card.name +
    `<div>
          <button class="deleteButton btn btn-danger btn-xsm">x</button>
        </div>`;
  var allCards = document.querySelector('.allCards');
  allCards.appendChild(cardTitle);
}
//close input block
var closeButton = document.querySelector('.closeButton');
closeButton.addEventListener('click', closeInputBlock);

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
  fetch(`https://api.trello.com/1/lists/${listId}/cards?key=${key}&token=${token}`, {
    method: 'GET'
  })
    .then(data => {
      data.json()
        // .then(data => console.log(data));
        .then(data =>
          data.forEach(data => {
            console.log(data)
            addcardtoDom(data)
          })
        )
    }).catch(error => console.log(error))

}
getAllCard();

//create event for delete Button
var cardList = document.querySelector('.allCards');
cardList.addEventListener('click', deleteCard);

//function for delete card
function deleteCard(event) {
  if (event.target.classList.value === 'deleteButton btn btn-danger btn-xsm') {
    var cardId = event.target.parentElement.parentElement.getAttribute('cardId');
    fetch(`https://api.trello.com/1/cards/${cardId}?key=${key}&token=${token}`, {
      method: 'DELETE'
    }).then(
      () => (event.target.parentElement.parentElement.style.display = 'none')
    )
      .catch(error => {
        console.log(error)
      });
    event.stopPropagation();
  }
}
//create event for popUp
cardList.addEventListener('click', popUpCheckList);

function popUpCheckList(event) {
  console.log(event.target.classList)
  if (event.target.classList.value == 'card') {
    // console.log(event.target)
    var card = document.querySelector('.modal');
    modelId = card.setAttribute('id', event.target.getAttribute('cardId'));
    document.querySelector('.modal-title').innerText = event.target.getAttribute('cardName');
    getAllCheckList(event.target.getAttribute('cardId'));
  }
}
var newCheckListButton = document.querySelector('.newCheckListButton');
newCheckListButton.addEventListener('click', openCheckListInput);

function openCheckListInput(event) {
  event.target.style.display = 'none';
  document.querySelector('.checkListInputDiv').style.display = 'block';
}

var checkListCloseButton = document.querySelector('.checkListCloseButton');
checkListCloseButton.addEventListener('click', closeCheckListInput);

function closeCheckListInput(event) {
  event.target.parentElement.parentElement.style.display = 'none';
  document.querySelector('.newCheckListButton').style.display = 'block';
}

var checkListAddButton = document.querySelector('.checkListAddButton');
checkListAddButton.addEventListener('click', addCheckList);

function addCheckListtoDom(checklist) {
  var newCheckList = document.createElement('div');
  newCheckList.setAttribute('id', checklist.id);
  newCheckList.classList = 'checkL';
  newCheckList.style.padding = '10px'
  newCheckList.innerHTML =
    checklist.name +
    `<div class="itemsContainer"></div>
        <div class='buttonsOfCheckList'>
        <div>
        <button class="addButtonForCheckItem btn btn-primary btn-xsm">add items</button>
        <button class="deleteButtonForCheckList btn btn-danger btn-xsm">x</button>
      </div>
      </div>
      <div class=itemInputDiv><input class="itemInput form-control" onfocus="this.value=''"placeholder="Enter Item Name">
      <div class='buttonsOfCheckItems'><div d-flex justify-content-start>
      <button class="addCheckItem btn btn-success btn-xsm">add New item</button>
      </div>
      <div>
        <button class="deleteButtonForCheckItem btn btn-danger btn-xsm">x</button>
      </div>
      </div>
      </div>`;
  var checkListContainer = document.querySelector('.checkListContainer');
  console.log(checkListContainer);
  checkListContainer.appendChild(newCheckList);
}

function addCheckList(event) {
  var checkListName = document.querySelector('.checkListInputTag');
  console.log(checkListName.value);
  var cardId = event.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.getAttribute('id');
  if (checkListName.value != '') {
    fetch(`https://api.trello.com/1/checklists?idCard=${cardId}&name=${checkListName.value}&key=${key}&token=${token}`, {
      method: 'POST'
    })
      .then(data => {
        data.json()
          .then(data => {
            addCheckListtoDom(data)
          })
      })
      .catch(error => console.log(error))
  }
}


function getAllCheckList(cardId) {
  fetch(
    `https://api.trello.com/1/cards/${cardId}/checklists?checkItems=all&checkItem_fields=name%2CnameData%2Cpos%2Cstate&filter=all&fields=all&key=${key}&token=${token}`
  )
    .then(data => {
      data.json()
        .then(data => {
          var checkListContainer = document.querySelector('.checkListContainer');
          checkListContainer.innerHTML = '<p><p>'; //create empty checkList container
          data.forEach(element => {
            addCheckListtoDom(element)
            getAllCheckItems(element.id, cardId);
          });
        })
    })
    .catch(error => console.log(error))
}

//create event for  selector checkList
var checkListContainer = document.querySelector('.checkListContainer');
checkListContainer.addEventListener('click', selector);

function selector(event) {
  if (event.target.classList.value === 'deleteButtonForCheckList btn btn-danger btn-xsm') {
    deleteCheckList(event);
  }
  else if (event.target.classList.value === 'addButtonForCheckItem btn btn-primary btn-xsm') {
    openItemInput(event);
  }
  else if (event.target.classList.value === 'addCheckItem btn btn-success btn-xsm') {
    addCheckItem(event);
  }
  else if (event.target.classList.value === 'deleteButtonForCheckItem btn btn-danger btn-xsm') {
    closeItemInput(event);
  } else if (
    event.target.classList.value === 'btn btn-default btn-xsm deleteButtonForItem'
  ) {
    deleteCheckItem(event);
  } else if (event.target.classList.value === 'checkBox') {
    checkItemStatus(event);
  }
  else if (event.target.classList.value === 'item') {
    updateCheckListItem(event)
  }
}

function deleteCheckList(event) {
  var id = event.target.parentElement.parentElement.parentElement.getAttribute('id');
  console.log(id);
  fetch(`https://api.trello.com/1/checklists/${id}?key=${key}&token=${token}`, {
    method: 'DELETE'
  }).then(() => {
    event.target.parentElement.parentElement.parentElement.remove();
  })
    .catch(error => console.log(error))
  event.stopPropagation();
}

function openItemInput(event) {
  // console.log('hello', event);
  event.target.parentElement.parentElement.parentElement.childNodes[3].style.display = 'none';
  event.target.parentElement.parentElement.parentElement.childNodes[5].style.display = 'block';
}


function closeItemInput(event) {
  event.target.parentElement.parentElement.parentElement.parentElement.childNodes[3].style.display = 'block';
  event.target.parentElement.parentElement.parentElement.parentElement.childNodes[5].style.display = 'none';
}

function addCheckItem(event) {
  checkItemName =
    event.target.parentElement.parentElement.parentElement.firstChild;
  id = event.target.parentElement.parentElement.parentElement.parentElement.getAttribute('id');
  let cardId = event.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.getAttribute('id');
  // console.log(cardId);
  //console.log(checkItemName.value);
  fetch(
    `https://api.trello.com/1/checklists/${id}/checkItems?name=${checkItemName.value}&pos=bottom&checked=false&key=${key}&token=${token}`,
    {
      method: 'POST'
    }
  ).then(data => {
    data.json()
      .then(data => {
        var itemsContainer = event.target.parentElement.parentElement.parentElement.parentElement.childNodes[1];
        var checkListItem = document.createElement('div');
        checkListItem.classList = 'checkListItem';
        checkListItem.setAttribute('id', data.id);
        checkListItem.setAttribute('cardId', cardId);
        checkListItem.innerHTML = checkListItem.innerHTML +
          `<input type="checkBox" class="checkBox"><p class ='item'>${data.name}</p>
        <button class="btn btn-default btn-xsm deleteButtonForItem">x</button>`;
        itemsContainer.appendChild(checkListItem);
        checkItemName.value = '';
      })
  })
    .catch(error => console.log(error))
}

function getAllCheckItems(id, cardId) {
  console.log(id);
  fetch(`https://api.trello.com/1/checklists/${id}/checkItems?key=${key}&token=${token}`, {
    method: 'GET'
  })
    .then(data => data.json())
    .then(data => {
      data.forEach(element => {
        var itemsContainer = document.getElementById(id).childNodes[1];
        var checkListItem = document.createElement('div');
        checkListItem.classList = 'checkListItem';
        checkListItem.setAttribute('id', element.id);
        checkListItem.setAttribute('cardId', cardId);
        checkListItem.innerHTML =
          checkListItem.innerHTML +
          `<input type="checkBox" class="checkBox"><p class="item">${element.name}</p>
          <button class="btn btn-default btn-xsm deleteButtonForItem">x</button>`;
        if (element.state === 'complete') {
          checkListItem.firstChild.checked = true;
          itemsContainer.appendChild(checkListItem);
        }
        itemsContainer.appendChild(checkListItem);
      });
    });
}
function deleteCheckItem(event) {
  var cardId = event.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.getAttribute('id');
  var checkItemId = event.target.parentElement.getAttribute('id');
  console.log(checkItemId);
  fetch(`https://api.trello.com/1/cards/${cardId}/checkItem/${checkItemId}?key=${key}&token=${token}`, {
    method: 'DELETE'
  }
  ).then(() => event.target.parentElement.remove())
    .catch(error => console.log(error))
}

function checkItemStatus(event) {
  var cardId = event.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.getAttribute('id');
  var checkItemId = event.target.parentElement.getAttribute('id');
  var status = 'incomplete';
  if (event.target.checked == true) { status = 'complete'; }
  fetch(`https://api.trello.com/1/cards/${cardId}/checkItem/${checkItemId}?state=${status}&key=${key}&token=${token}`, {
    method: 'PUT'
  })
    .catch(error => console.log(error))
}

function updateCheckListItem(event) {
  var cardId = event.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.getAttribute('id');
  var checkItemId = event.target.parentElement.getAttribute('id');
  console.log(event.target)
  const newItemName = prompt("Enter Item Name")
  fetch(`https://api.trello.com/1/cards/${cardId}/checkItem/${checkItemId}?name=${newItemName}&key=${key}&token=${token}`, {
    method: 'PUT'
  }
  )
    .then(data => {
      data.json()
        .then(data => {
          var item = event.target
          event.target.innerText = newItemName
        })
    })
    .catch(error => console.log(error))
}


