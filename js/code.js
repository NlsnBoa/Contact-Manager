const urlBase = "http://galacticrolodex.com/";
const extension = "php";

let userId = 0;
let firstName = "";
let lastName = "";

// Post request to Login API Endpoint
function doLogin() {
  userId = 0;
  firstName = "";
  lastName = "";

  let login = document.getElementById("loginName").value;
  let password = document.getElementById("loginPassword").value;
  //	var hash = md5( password );

  document.getElementById("loginResult").innerHTML = "";

  let tmp = { login: login, password: password };
  //	var tmp = {login:login,password:hash};
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
  
  let tmp = { firstname: firstname, lastname: lastname, login: login, password: password };
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
      "Logged in as " + firstName + " " + lastName;
  }
}

function doSearch() {
  // Define the endpoint URL
  const endpointUrl = 'http://galacticrolodex.com/LAMPAPI/SearchContact.php';

  // Define the JSON data to be sent in the request body
  const inData = {
    "userID": 2
  };

  // Define the request options
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(inData)
  };

  // Send the POST request
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
      // const resultContainer = document.getElementById('result-container');
      // resultContainer.textContent = JSON.stringify(data, null, 2);
    })
    .catch(error => {
      console.error('Fetch error:', error);
    });
}

let selectedRowData = null;

function createTable(data) {
  // Get the result container where you want to display the table
  const resultContainer = document.getElementById('result-container');

  // Check if the "results" property exists in the data
  if (data.hasOwnProperty('results')) {
    const resultData = data.results; // Extract the array of objects from "results"

    if (resultData.length > 0) {
      // Create a table element
      const table = document.createElement('table');

      // Create a table header row
      const headerRow = table.insertRow(0);

      // Extract the keys (column names) from the first object in the JSON data
      const keys = Object.keys(resultData[0]);

      // Create header cells with the column names
      keys.forEach(key => {
        const th = document.createElement('th');
        th.textContent = key;
        headerRow.appendChild(th);
      });

      // Create table rows for each data object
      resultData.forEach(item => {
        const row = table.insertRow();
        keys.forEach(key => {
          const cell = row.insertCell();
          cell.textContent = item[key];
        });

        row.addEventListener('click', () => {
          selectedRowData = item; // Store the data of the selected row
        });
      });

      // Clear the result container and append the table
      resultContainer.innerHTML = '';
      resultContainer.appendChild(table);
    } else {
      // If the "results" array is empty, display a message
      resultContainer.textContent = 'No data to display.';
    }
  } else {
    // If the "results" property is missing, display an error message
    resultContainer.textContent = 'Error: Data format is incorrect.';
  }
}

// Add "Delete" and "Update" buttons at the top of the table
const deleteButton = document.createElement('button');
deleteButton.textContent = 'Delete';
deleteButton.addEventListener('click', () => {
  if (selectedRowData) {
    // Call the delete function with the selected row's data
    deleteItem(selectedRowData);
  } else {
    alert('Please select a row to delete.');
  }
});

const updateButton = document.createElement('button');
updateButton.textContent = 'Update';
updateButton.addEventListener('click', () => {
  if (selectedRowData) {
    // Call the update function with the selected row's data
    updateItem(selectedRowData);
  } else {
    alert('Please select a row to update.');
  }
});

// Add the buttons to the top of the table or any other container
const tableContainer = document.getElementById('table-container');
tableContainer.appendChild(deleteButton);
tableContainer.appendChild(updateButton);

function doDelete(data) {

}

function doUpdate(data) {
  
}
