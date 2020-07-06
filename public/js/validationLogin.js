const formLogin = document.getElementById('formLogin');
const fieldLogin = document.getElementById('login');
const errorsLogin = document.getElementById('errors_login');
const fieldPassword = document.getElementById('password');
const errorsPassword = document.getElementById('errors_password');
const errorsInfo = document.getElementById('errors_info');
const errorsSummary = document.getElementById('errors_summary');

var errorMessages = {
  login: "Pole 'Login' jest wymagane",
  password: "Pole 'Password' jest wymagane",
};

function removeErrorClass(element, error){
  element.classList.remove("errors-input");
  error.innerHTML = "";
}


function validateLoginInput(messages,element, error) {
  if(!element.value.trim()){
    messages.push(errorMessages[element.getAttribute('id')]);
    error.innerHTML = errorMessages[element.getAttribute('id')];
    element.classList.add("errors-input");
    errorsInfo.innerHTML = "Formularz zawiera błędy";
  }  else {
    removeErrorClass(element, error);
  }
}

function validateFormLogin(event) {
  let messages = [];

  validateLoginInput(messages, fieldLogin, errorsLogin);
  validateLoginInput(messages, fieldPassword, errorsPassword);

  if (messages.length > 0) {
    event.preventDefault();
    errorsSummary.innerHTML = messages.join('\n');
  }
  else{
    removeErrorClass(fieldLogin, errorsLogin);
    removeErrorClass(fieldPassword, errorsPassword);

    errorsInfo.innerHTML = "";
    errorsSummary.innerHTML = "";
  }
}


formLogin.addEventListener('submit', validateFormLogin);
