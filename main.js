
// document.addEventListener("DOMContentLoaded", function() {
  let allCalories = [];
  const caloriesList = document.getElementById('calories-list');
  const newCalorieForm = document.getElementById('new-calorie-form');
  const editCalorieForm = document.getElementById('edit-calorie-form')
  const buttonAdd = document.getElementById('id')
/////////////////////////Create New Calorie//////////////////////////////

  function createCalories(event, allCalories) {
    event.preventDefault()
    let kcalInputForm = document.getElementById('kcal-input').value
    let notesInputForm = document.getElementById('note-input').value

    fetch("http://localhost:3000/api/v1/calorie_entries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
       api_v1_calorie_entry: {
           calorie: parseInt(kcalInputForm),
           note: notesInputForm
       }
      })
    })
    .then(resp => resp.json())
    .then(parsedJason => {
      allCalories.unshift(parsedJason)
      let newAllCalories = loadList(allCalories)
      caloriesList.innerHTML = newAllCalories
    })

  }

/////////////// Show all Calories on the DOM/////////////////////////
  function loadList() {
    fetch("http://localhost:3000/api/v1/calorie_entries#index")
      .then(resp => resp.json())
      .then(calories => {
        allCalories = calories
        caloriesList.innerHTML = addCaloriesToLi(allCalories)
      })
  }

  function addCaloriesToLi(array) {
    return array.map(addCaloriesToDiv).join("")
  }

  function addCaloriesToDiv(calorie) {
    return (`<li class="calories-list-item" data-id="${calorie.id}">
       <div class="uk-grid">
         <div class="uk-width-1-6">
           <strong>${calorie.calorie}</strong>
           <span>kcal</span>
         </div>
         <div class="uk-width-4-5">
           <em class="uk-text-meta">${calorie.note}</em>
         </div>
       </div>
       <div class="list-item-menu">
         <a id = "edit-btn" class="edit-button" uk-toggle="target: #edit-form-container" uk-icon="icon: pencil"></a>
         <a id = "del-btn" class="delete-button" uk-icon="icon: trash"></a>
       </div>
     </li>`)
  }

  // function editDog() {
  //   let entryId = event.target.querySelector()
  //   debugger;
  // }
/////////////////////////////Event Listeners/////////////////////////////////
newCalorieForm.addEventListener('submit', (event) => createCalories(event, allCalories))
editCalorieForm.addEventListener('click', editDog)

  loadList()

// })
