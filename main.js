////// GLOBAL VARIABLES //////
const entryList = document.getElementById("calories-list");
const progressBar = document.getElementsByTagName("progress")[0];
const calInput = document.getElementById("form-input-cal");
const notesInput = document.getElementById("form-input-notes");
const newEntryForm = document.getElementById("new-calorie-form");
const editCalInput = document.querySelector("#edit-form-container input");
const editNotesInput = document.querySelector("#edit-form-container textarea");
const editEntryForm = document.querySelector("#edit-calorie-form");



//Fetches data of all calorie entries
function fetchAllData() {
  fetch("http://localhost:3000/api/v1/calorie_entries")
    .then( res => res.json() )
    .then( allEntryData => appendCalorieEntries(allEntryData) )
    .catch( error => console.log(error.message) )
}

//Sets innerHTML of entryList to concatonated string made of calorie entry elements, updates calorie sum
function appendCalorieEntries(allEntryData) {
  let entryString = "";
  let calSum = 0;
  allEntryData.map( entry => {
    entryString += createCalorieEntryHTML(entry);
    calSum += entry.calorie;
  });
  entryList.innerHTML = entryString;
  progressBar.value = calSum;
}

//Creates HTML for a single calorie entry
function createCalorieEntryHTML(singleEntryData) {
  let element = `
    <li class="calories-list-item" data-id="${singleEntryData.id}">
      <div class="uk-grid">
        <div class="uk-width-1-6">
          <strong>${singleEntryData.calorie}</strong>
          <span>kcal</span>
        </div>
        <div class="uk-width-4-5">
          <em class="uk-text-meta">${singleEntryData.note}<br></br></em>
        </div>
      </div>
      <div class="list-item-menu">
        <a class="edit-button" uk-icon="icon: pencil" uk-toggle="target: #edit-form-container"></a>
        <a class="delete-button" uk-icon="icon: trash"></a>
      </div>
    </li>
  `
  return element;
}

////// ADD ENTRY FUNCTIONS //////

//Determines if new calorie entry form is properly filled it, provides indications if not
function submitEntry() {
  event.preventDefault();
  if (calInput.value && notesInput.value) {
    addEntry(event.target)
    calInput.style.borderColor = "";
    notesInput.style.borderColor = "";
  } else {
    calInput.value ? calInput.style.borderColor = "" : calInput.style.borderColor = "red";
    notesInput.value ? notesInput.style.borderColor = "" : notesInput.style.borderColor = "red";
  }
}

//Fetch request to add calorie entry to database
function addEntry(event) {
  fetch("http://localhost:3000/api/v1/calorie_entries", addObj())
    .then( res => res.json() )
    .then( () => {
      event.reset();
      fetchAllData();
    })
    .catch( error => console.log(error.message) );
}

//Returns deleteObj used in deleteEntry
function addObj() {
  return {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      api_v1_calorie_entry: {
        calorie: parseInt(calInput.value),
        note: notesInput.value
      }
    })
  }
}


////// DELETE ENTRY FUNCTIONS //////

//Manages bubbling for delete buttons on entryList
function deleteEntryHandler() {
  let clicked = event.target;
  if (clicked.dataset.svg === "trash") {
    let entryId = clicked.parentElement.parentElement.parentElement.dataset.id;
    deleteEntry(entryId);
  }
}

//Fetch request to delete calorie entry from database
function deleteEntry(entryId) {
  fetch(`http://localhost:3000/api/v1/calorie_entries/${entryId}`, deleteObj())
    .then( res => res.json() )
    .then( () => fetchAllData() )
    .catch( error => console.log(error.message) )
}

//Returns deleteObj used in deleteEntry
function deleteObj() {
  return {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    }
  }
}

////// EDIT ENTRY FUNCTIONS //////

//Manages bubbling for edit buttons on entryList
function editEntryHandler() {
  let clicked = event.target;
  if (clicked.dataset.svg === "pencil") {
    let entryId = clicked.parentElement.parentElement.parentElement.dataset.id;
    populateEditForm(entryId);
  }
}

//Populates edit form fields when edit button is clicked, resets border color to black
function populateEditForm(entryId) {
  editCalInput.value = document.querySelector(`li[data-id="${entryId}"] strong `).innerHTML;
  editNotesInput.value = document.querySelector(`li[data-id="${entryId}"] em `).innerHTML.slice(0, -8);
  editCalInput.style.borderColor = "";
  editNotesInput.style.borderColor = "";
  editEntryForm.dataset.entryId = entryId;
}

//Determines if edit calorie entry form is properly filled it, provides indications if not
function submitEdit() {
  event.preventDefault();
  if (editCalInput.value && editNotesInput.value) {
    editEntry(event.target)
    editCalInput.style.borderColor = "";
    editNotesInput.style.borderColor = "";
  } else {
    editCalInput.value ? editCalInput.style.borderColor = "" : editCalInput.style.borderColor = "red";
    editNotesInput.value ? editNotesInput.style.borderColor = "" : editNotesInput.style.borderColor = "red";
  }
}

//Fetch request to edit calorie entry from database
function editEntry(entryId) {
  fetch(`http://localhost:3000/api/v1/calorie_entries/${entryId.dataset.entryId}`, editObj())
    .then( res => res.json() )
    .then( () => {
      fetchAllData()
      document.getElementById("x-edit-button").click();
    })
    .catch( error => console.log(error.message) )
}

//Returns editObj used in deleteEntry
function editObj() {
  return {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      api_v1_calorie_entry: {
        calorie: parseInt(editCalInput.value),
        note: editNotesInput.value
      }
    })
  }
}




////// EVENT LISTENERS //////
entryList.addEventListener("click", deleteEntryHandler);
entryList.addEventListener("click", editEntryHandler);
newEntryForm.addEventListener("submit", submitEntry);
editEntryForm.addEventListener("submit", submitEdit);


////// INVOKED FUNCTIONS //////

fetchAllData();
