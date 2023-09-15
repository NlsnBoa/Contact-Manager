const urlBase = "http://galacticrolodex.com/";
const extension = "php";

let userId = 0;
let firstName = "";
let lastName = "";
let id = 0;

// Post request to Login API Endpoint
function doLogin() {
  userId = 0;
  firstName = "";
  lastName = "";

  let login = document.getElementById("loginName").value;
  let password = document.getElementById("loginPassword").value;
  var hash = md5( password );

  document.getElementById("loginResult").innerHTML = "";

  // let tmp = { login: login, password: password };
  var tmp = {login:login,password:hash};
  let jsonPayload = JSON.stringify(tmp);

  let url = urlBase + "LAMPAPI/Login." + extension;
  console.log(url);
  
  
  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  
  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        let jsonObject = JSON.parse(xhr.responseText);
        userId = jsonObject.id;

        if (userId < 1) {
          document.getElementById("loginResult").innerHTML =
            "User/Password combination incorrect";
          return;
        }

        firstName = jsonObject.firstName;
        lastName = jsonObject.lastName;

        saveCookie();

        window.location.href = "contactpage.html";
      }
    };
    xhr.send(jsonPayload);
  } catch (err) {
    document.getElementById("loginResult").innerHTML = err.message;
  }
}

// Post request to Register API
function doRegister() {
  error = "";
  
  let firstname = document.getElementById("firstName").value;
  let lastname = document.getElementById("lastName").value;
  let login = document.getElementById("loginName").value;
  let password = document.getElementById("loginPassword").value;
  
  document.getElementById("loginResult").innerHTML = "";
  
  var hash = md5(password);
  
  let tmp = { firstname: firstname, lastname: lastname, login: login, password: hash };
  let jsonPayload = JSON.stringify(tmp);
  
  let url = urlBase + "LAMPAPI/Register." + extension;
  
  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  
  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        let jsonObject = JSON.parse(xhr.responseText);
        error = jsonObject.error;

        if (error == "User already exists") {
          document.getElementById("loginResult").innerHTML =
            "User already exists";
          return;
        }

        window.location.href = "login.html";
      }
    };
    xhr.send(jsonPayload);
  } catch (err) {
    document.getElementById("loginResult").innerHTML = err.message;
  }
}

function saveCookie() {
  let minutes = 20;
  let date = new Date();
  date.setTime(date.getTime() + minutes * 60 * 1000);
  document.cookie =
    "firstName=" +
    firstName +
    ",lastName=" +
    lastName +
    ",userId=" +
    userId +
    ";expires=" +
    date.toGMTString();
}

function readCookie() {
  userId = -1;
  let data = document.cookie;
  let splits = data.split(",");
  for (var i = 0; i < splits.length; i++) {
    let thisOne = splits[i].trim();
    let tokens = thisOne.split("=");
    if (tokens[0] == "firstName") {
      firstName = tokens[1];
    } else if (tokens[0] == "lastName") {
      lastName = tokens[1];
    } else if (tokens[0] == "userId") {
      userId = parseInt(tokens[1].trim());
    }
  }

  if (userId < 0) {
    window.location.href = "index.html";
  } else {
    document.getElementById("userName").innerHTML =
      "Greetings, " + firstName + " " + lastName;
  }
}

function fetchContacts() {
  const endpointUrl = 'http://galacticrolodex.com/LAMPAPI/SearchContact.php';

  const inData = {
    "userID": userId
  };

  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(inData)
  };

  fetch(endpointUrl, requestOptions)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
      createTable(data);
    })
    .catch(error => {
      console.error('Fetch error:', error);
    });
}

function createTable(data) {
  const resultContainer = document.getElementById('result-container');

  if (data.hasOwnProperty('results')) {
    const resultData = data.results;

    // create table if data exists
    if (resultData.length > 0) {
      const table = document.createElement('table');
      table.classList.add('custom-table');

      // create headers for each column
      const headerRow = table.insertRow(0);
      const keys = Object.keys(resultData[0]);
      keys.forEach(key => {
        if (key !== 'UserID' && key !== 'ID') {
          const th = document.createElement('th');
          th.textContent = key;
          headerRow.appendChild(th);
        }
      });
      const additionalTh = document.createElement('th');
      headerRow.appendChild(additionalTh);

      // insert data by rows into table
      resultData.forEach(item => {
        const row = table.insertRow();
        row.classList.add('table-row');
        keys.forEach(key => {
          if (key !== 'UserID' && key !== 'ID') {
            const cell = row.insertCell();
            cell.textContent = item[key];
          }
        });

        // styling for delete & update buttons
        const deleteButton = document.createElement('img');
        deleteButton.src = '../images/delete.png';
        deleteButton.width = 40;
        deleteButton.height = 40;
        deleteButton.classList.add('delete-button');
        deleteButton.style.opacity = '0';
        deleteButton.addEventListener('click', () => {
          console.log('Delete button clicked for', item);
          doDelete(item);
        });
        const updateButton = document.createElement('img');
        updateButton.src = '../images/update.png'; 
        updateButton.width = 40; 
        updateButton.height = 40;
        updateButton.classList.add('update-button');
        updateButton.style.opacity = '0'; 
        updateButton.addEventListener('click', () => {
          console.log('Update button clicked for', item);
          doUpdate(item);
        });

        // Hover event listeners make buttons appear and disappear
        row.addEventListener('mouseenter', () => {
          deleteButton.style.opacity = '1'; 
          updateButton.style.opacity = '1'; 
        });
        row.addEventListener('mouseleave', () => {
          deleteButton.style.opacity = '0';
          updateButton.style.opacity = '0'; 
        });

        row.appendChild(deleteButton);
        row.appendChild(updateButton);
      });

      resultContainer.innerHTML = '';
      resultContainer.appendChild(table);
    } else {
      resultContainer.textContent = 'No data to display.';
    }
  } else {
    resultContainer.textContent = 'Error: Data format is incorrect.';
  }
}

function doCreate() {
  let firstname = document.getElementById("firstName").value;
  let lastname = document.getElementById("lastName").value;
  let phone = document.getElementById("phone").value;
  let email = document.getElementById("email").value;
  
  console.log("Adding contact with info: " + firstname + " " + lastname);
  
  let url = urlBase + 'LAMPAPI/AddContact.' + extension;
  let tmp = {firstname: firstname, lastname: lastname, phone: phone, email: email, userId: userId};
  let jsonPayload = JSON.stringify(tmp);
  
  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  
  try {
      xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          console.log('A contact has been created.');
          fetchContacts();
        }
      };
      xhr.send(jsonPayload);
    } catch (err) {
      console.log(err.message);
    }
}

function doDelete(data) {
  // console.log(ID);
  
  let delete_check = confirm('Are you sure you want to delete ' + data['FirstName'] + ' ' + data['LastName'] + '?');
  
  if (delete_check === true) {
  
    let tmp = {id: data['ID']};
    let url = urlBase + 'LAMPAPI/DeleteContact.' + extension;
    let jsonPayload = JSON.stringify(tmp);
  
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  
    try {
      xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          console.log('A contact has been deleted.');
          fetchContacts();
        }
      };
      xhr.send(jsonPayload);
    } catch (err) {
      console.log(err.message);
    }
  }
  else {
    alert('Deletion Canceled');
  }
  
}

function doSearch() {
  const endpointUrl = 'http://galacticrolodex.com/LAMPAPI/SearchContact.php';
  
  let keyword = document.getElementById("search").value;
  
  const inData = {
    keyword: keyword,
    userID: userId
  };

  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(inData)
  };

  fetch(endpointUrl, requestOptions)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
      createTable(data);
    })
    .catch(error => {
      console.error('Fetch error:', error);
    });
}

function doUpdate(data) {

  openUpdatePopup();
  
  document.getElementById("updatefirstName").value = data["FirstName"];
  document.getElementById("updatelastName").value = data["LastName"];
  document.getElementById("updatephone").value = data["Phone"];
  document.getElementById("updateemail").value = data["Email"];
  
  id = data["ID"];
  
}

function saveUpdate(data) {
  let firstname = document.getElementById("updatefirstName").value;
  let lastname = document.getElementById("updatelastName").value;
  let phone = document.getElementById("updatephone").value;
  let email = document.getElementById("updateemail").value;
  
  let url = urlBase + 'LAMPAPI/UpdateContact.' + extension;
  let tmp = {userID: userId, firstName: firstname, lastName: lastname, phone: phone, email: email, id: id};
  let jsonPayload = JSON.stringify(tmp);
  
  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  
  try {
      xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          console.log('A contact has been updated.');
          fetchContacts();
        }
      };
      xhr.send(jsonPayload);
    } catch (err) {
      console.log(err.message);
    }
}

function openCreatePopup() {
  var modal = document.getElementById("myModal");
  var overlay = document.getElementById("overlay");
  modal.style.display = "block";
  overlay.style.display = "block";
}

function closeCreatePopup() {
  // console.log("Attempting to close pop-up");
  var modal = document.getElementById("myModal");
  var overlay = document.getElementById("overlay");
  modal.style.display = "none";
  overlay.style.display = "none";
}

function openUpdatePopup() {
  var modal = document.getElementById("UpdateModal");
  var overlay = document.getElementById("overlay");
  modal.style.display = "block";
  overlay.style.display = "block";
}

function closeUpdatePopup() {
  // console.log("Attempting to close pop-up");
  var modal = document.getElementById("UpdateModal");
  var overlay = document.getElementById("overlay");
  modal.style.display = "none";
  overlay.style.display = "none";
}