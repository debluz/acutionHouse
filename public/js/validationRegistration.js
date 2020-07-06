const formRegistration = document.getElementById('formRegistration');
const fieldLogin = document.getElementById('login');
const errorsLogin = document.getElementById('errors_login');
const fieldPassword = document.getElementById('password');
const errorsPassword = document.getElementById('errors_password');
const fieldFirstName = document.getElementById('first_name');
const errorsFirstName = document.getElementById('errors_first_name');
const fieldSecondName = document.getElementById('second_name');
const errorsSecondName = document.getElementById('errors_second_name');
const fieldBirthday = document.getElementById('birthday');
const errorsBirthday = document.getElementById('errors_birthday');
const fieldAddress = document.getElementById('address');
const errorsAddress = document.getElementById('errors_address');
const fieldPostalCode = document.getElementById('postal_code');
const errorsPostalCode = document.getElementById('errors_postal_code');
const errorsInfo = document.getElementById('errors_info');
const errorsSummary = document.getElementById('errors_summary');

const loginREGEX = /^[a-zA-Z0-9]+$/;
const passwordREGEX = /^\S{6,}$/;
const nameREGEX = /^[a-zA-Z]+$/;
const addressREGEX = /^[a-zA-z]+\s\d+\/*\d*$/;
const postalCodeREGEX = /^[0-9]{2}\-[0-9]{3}$/;



var errorMessages = {
  login: "Pole 'Login' jest wymagane",
  password: "Pole 'Password' jest wymagane",
  first_name: "Pole 'Imię' jest wymagane",
  second_name: "Pole 'Nazwisko' jest wymagane",
  birthday: "Pole 'Data urodzenia' jest wymagane",
  address: "Pole 'Ulica' jest wymagane",
  postal_code: "Pole 'Kod pocztowy' jest wymagane",
};

var patternMessages = {
  login: "Można używać tylko litery i cyfry",
  password: "Hasło musi mieć min. 6 znaków, bez białych znaków",
  first_name: "Pole 'Imię' może zawierać tylko litery",
  second_name: "Pole 'Nazwisko' może zawierać tylko litery",
  address: "Np. Szkolna 2/1",
  postal_code: "Np. 00-000",
};



function checkPattern(element, regex) {
  var value = element.value;
  var result = regex.test(value);
  return result;
}

function removeErrorClass(element, error){
  element.classList.remove("errors-input");
  error.innerHTML = "";
}


function validateInput(messages,element, regex, error) {
  if(!element.value.trim()){
    messages.push(errorMessages[element.getAttribute('id')]);
    error.innerHTML = errorMessages[element.getAttribute('id')];
    element.classList.add("errors-input");
    errorsInfo.innerHTML = "Formularz zawiera błędy";
  } else if(element.value.trim() && !checkPattern(element, regex)){
    messages.push(errorMessages[element.getAttribute('id')]);
    error.innerHTML = patternMessages[element.getAttribute('id')];
    element.classList.add("errors-input");
    errorsInfo.innerHTML = "Formularz zawiera błędy";
  } else {
    removeErrorClass(element, error);
  }
}


function validateDateInput(messages,element, error) {
  if(!element.value.trim()){
    messages.push(errorMessages[element.getAttribute('id')]);
    error.innerHTML = errorMessages[element.getAttribute('id')];
    element.classList.add("errors-input");
    errorsInfo.innerHTML = "Formularz zawiera błędy";
  }  else {
    removeErrorClass(element, error);
  }
}

/* REGISTRATION */

function validateFormRegistration(event) {
  let messages = [];

  validateInput(messages, fieldLogin, loginREGEX, errorsLogin);
  validateInput(messages, fieldPassword, passwordREGEX, errorsPassword);
  validateInput(messages, fieldFirstName, nameREGEX, errorsFirstName);
  validateInput(messages, fieldSecondName, nameREGEX, errorsSecondName);
  validateDateInput(messages, fieldBirthday, errorsBirthday);
  validateInput(messages, fieldAddress, addressREGEX, errorsAddress);
  validateInput(messages, fieldPostalCode, postalCodeREGEX, errorsPostalCode);

  if (messages.length > 0) {
    event.preventDefault();
    errorsSummary.innerHTML = messages.join('\n');
  }
  else{
    removeErrorClass(fieldLogin, errorsLogin);
    removeErrorClass(fieldPassword, errorsPassword);
    removeErrorClass(fieldFirstName, errorsFirstName);
    removeErrorClass(fieldSecondName, errorsSecondName);
    removeErrorClass(fieldBirthday, errorsBirthday);
    removeErrorClass(fieldAddress, errorsAddress);
    removeErrorClass(fieldPostalCode, errorsPostalCode);
    errorsInfo.innerHTML = "";
    errorsSummary.innerHTML = "";
  }
}



formRegistration.addEventListener('submit', validateFormRegistration);


