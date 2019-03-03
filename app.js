/*
    * ================== Function openTab ==================
*/
function openTab(event, cityName) {
  //vars
  let i, tabcontent, tablinks;

  //get tabs' content by class name and convert HTMLCollection into array
  tabcontent = Array.from(document.getElementsByClassName("tabcontent"));

  tabcontent.forEach(function(tab) {
    tab.style.display = "none";
  });

  //get all tablinks by class name and convert HTMLCollection into array
  tablinks = Array.from(document.getElementsByClassName("tablinks"));

  tablinks.forEach(function(tablink) {
    tablink.className = tablink.className.replace(" active", "");
  });

  document.getElementById(cityName).style.display = "block";
  event.currentTarget.className += " active";
}

// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();



/*
    * ================== Add, delete, edit Note  ==================
*/

// Note Constructor
function Note(id, title, time, author, body) {
  this.id = id;
  this.title = title;
  this.time = time;
  this.author = author;
  this.body = body;
}

// UI Constructor
function UI() {}

//Add a Note
UI.prototype.addNoteTolist = function(note) {
  const list = document.querySelector('.notes');
  // Create a div
  const div = document.createElement('div');
  div.className = 'note';
  div.innerHTML = `
      <h3 class="note__title">${note.title}</h3>
      <p class="note__date">${note.time} by ${note.author}</p>
      <p class="note__text">${note.body}</p>
      <input type="hidden" id="${note.id}" value="${note.id}"/>
      <button type="button" class="note__delete">Delete</button> 
  `;

  list.appendChild(div);
  
};

//Clear fields
UI.prototype.clearFields = function(){
  document.querySelector('.form__input--title').value = '';
  document.querySelector('.form__input--author').value = '';
  document.querySelector('.form__input--body').value = '';
}

//delete a Note
UI.prototype.deleteNote = function(note){
  if(note.className === 'note__delete') {
    if(confirm('Are you sure that you want to delete this note?')) {
       note.parentElement.remove();
    }
  }
}

// Show message
UI.prototype.showAlert = function(message, className) {
  //Create div
  const div = document.createElement('div');
  //Add class to div
  div.className = `alert ${className}`;
  //Add text
  div.appendChild(document.createTextNode(message));
  //Get parent
  const formDiv = document.querySelector('.form-div');
  //Get form
  const form = document.querySelector('.form');
  //Insert alert
  formDiv.insertBefore(div, form);
   // Timeout after 3 sec
   setTimeout(function(){
    document.querySelector('.alert').remove()
}, 3000);
  
}

// Store constructor
function Store() {}

//Get Notes from LS
Store.prototype.getNotes = function() {
  let notes;
  if(localStorage.getItem('notes') === null) {
    notes = [];
  } else {
    notes = JSON.parse(localStorage.getItem('notes'));
  }

  return notes;
}
// Display Notes from LS
Store.prototype.displayNotes = function(){
  const notes = store.getNotes();

  notes.forEach(function(note){
    const ui = new UI;

    //Add note to UI
    ui.addNoteTolist(note);
  });
}

//Add a Note to LS
Store.prototype.addNote = function(note) {
  // Instantiate store
  const store = new Store;
  const notes = store.getNotes();

  notes.push(note);
  localStorage.setItem('notes', JSON.stringify(notes));
}

//Delete a Note from LS
Store.prototype.removeNote = function(id) {
  // Instantiate store
  const store = new Store;
  const notes = store.getNotes();

  notes.forEach(function(note, index) {
    if(note.id === id) {
      notes.splice(index, 1);
    }
  });

  localStorage.setItem('notes', JSON.stringify(notes));
  
}

// Instantiate store
const store = new Store;
//DOM Load Event
document.addEventListener('DOMContentLoaded', store.displayNotes)

//Event listener for add Note
document.querySelector('.form').addEventListener('submit', (e) => {
  e.preventDefault();
  
  //Get form values
  const title = document.querySelector('.form__input--title').value,
        author = document.querySelector('.form__input--author').value,
        body = document.querySelector('.form__input--body').value,
        id = (new Date().getUTCMilliseconds()+ Math.random()+1).toString(36),
        time = new Date().toLocaleString();

  // Instantiate note
  const note = new Note(id, title, time, author, body);

  // Check if empty inputs
  if(title == '' || author == '' || body == '') {
    // Instantiate UI
    const ui = new UI;
    ui.showAlert('All fields are required!', 'error');
  }else {
    // Instantiate UI
    const ui = new UI;
    // Add note to list
    ui.addNoteTolist(note);
    // Instantiate store
    const store = new Store;
    //Add a note to LS
    store.addNote(note);
    //Show message
    ui.showAlert('You added successfuly!', 'success');
    //Clear fields
    ui.clearFields();
  }
 
});

//Event listener for delete Note
document.querySelector('.notes').addEventListener('click', (e)=>{
  e.preventDefault();
  
  // Instantiate UI
  const ui = new UI();

  //Delete note
  ui.deleteNote(e.target);

  const store = new Store;
  store.removeNote(e.target.previousElementSibling.id);

 
});

//Event listener for search
document.querySelector('.search__input').addEventListener('keyup', (e) => {
  const text = e.target.value.toLowerCase();

  document.querySelectorAll('.note').forEach((note) => {
 
    const item = note.firstElementChild.textContent;
    
    if(item.toLowerCase().indexOf(text) != -1) {
      note.style.display = 'block';
      
    }else {
      note.style.display = 'none';
    }
  });
});
