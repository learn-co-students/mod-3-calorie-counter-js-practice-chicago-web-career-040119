// your code here, it may be worth it to ensure this file only runs AFTER the dom has loaded.

const newCalForm = document.getElementById("new-calorie-form")
const calListContainer = document.getElementById("calories-list")
const editForm = document.getElementById("edit-calorie-form")
let allCalories = []



///////////////Display all Calories on the dom//////////////
function loadCal() {
    fetch("http://localhost:3000/api/v1/calorie_entries#index")
    .then(resp => resp.json())
    .then(calData => {
      allCalories = calData
      calListContainer.innerHTML= addDivToDom(allCalories)
    })
}


/////////////add new calories//////////
newCalForm.addEventListener("submit", (event) => createCalIntake(event, allCalories))
editForm.addEventListener("submit", (event) => editCal(event))

function createCalIntake(event, allCalories) {
  event.preventDefault();

  let newCal = document.getElementById("new-cal")
  let newNote = document.getElementById("new-note")

  fetch("http://localhost:3000/api/v1/calorie_entries", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      api_v1_calorie_entry: {
      calorie: newCal.value,
      note: newNote.value
     }
    })
  })
  .then(resp => resp.json())
  .then(newCal => {
    allCalories.push(newCal)
    let newCalorieData = addDivToDom(allCalories)
    calListContainer.innerHTML = newCalorieData
  })
}

////////append data to dom ///////////
function addDivToDom(array) {
  return array.map(addCalsDataToDom).join("")
}

function addCalsDataToDom(cal){
 return (`
   <li class="calories-list-item" data-id="${cal.id}">
    <div class="uk-grid">
      <div class="uk-width-1-6">
        <strong> ${cal.calorie} </strong>
        <span>kcal</span> </div>
      <div class="uk-width-4-5">
        <em class="uk-text-meta"> ${cal.note} </em>
      </div>
    </div>
    <div class="list-item-menu">
      <a class="edit-button" uk-toggle="target: #edit-form-container" uk-icon="icon: pencil"></a>
      <a class="delete-button" uk-icon="icon: trash"></a>
     </div>
  </li>`)
}



loadCal(allCalories);
