const formAddingProduct = document.getElementById('formAddingProduct');
/* ADDING PRODUCT */
const fieldProductName = document.getElementById("product_name");
const errorsProductName = document.getElementById("errors_product_name");
const fieldBrand = document.getElementById("brand");
const errorsBrand = document.getElementById("errors_brand");
const fieldSize = document.getElementById("size");
const errorsSize = document.getElementById("errors_size");
const fieldYear = document.getElementById("year");
const errorsYear = document.getElementById("errors_year");
const fieldDescription = document.getElementById("description");
const errorsDescription = document.getElementById("errors_description");
const errorsInfo = document.getElementById('errors_info');
const errorsSummary = document.getElementById('errors_summary');


/* REGEX */
const nameREGEX = /^[a-zA-Z0-9\s]+$/;
const brandREGEX = /^[a-zA-Z0-9\s]+$/;


var errorMessages = {
  product_name: "Pole 'Nazwa' jest wymagane",
  brand: "Pole 'Marka' jest wymagane",
  size: "Pole 'Rozmiar' jest wymagane",
  year: "Pole 'Rok produkcji' jest wymagane",
  description: "Pole 'Opis' jest wymagane"
};

var patternMessages = {
  product_name: "Pole 'Nazwa' nie może zawierać znaków specjalnych",
  brand: "Pole 'Marka' nie może zawierać cyfr oraz znaków",
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

function validateDescriptionInput(messages,element, error) {
  if(!element.value.trim()){
    messages.push(errorMessages[element.getAttribute('id')]);
    error.innerHTML = errorMessages[element.getAttribute('id')];
    element.classList.add("errors-input");
    errorsInfo.innerHTML = "Formularz zawiera błędy";
  }  else {
    removeErrorClass(element, error);
  }
}

function validateNumberInput(messages, min_year, max_year, element, error){
  if(!element.value.trim()){
    messages.push(errorMessages[element.getAttribute('id')]);
    error.innerHTML = errorMessages[element.getAttribute('id')];
    element.classList.add("errors-input");
    errorsInfo.innerHTML = "Formularz zawiera błędy";
  } else if(element.value.trim() && element.value < min_year || element.value > max_year){
    messages.push(errorMessages[element.getAttribute('id')]);
    error.innerHTML = "min. "+min_year+" max. "+max_year;
    element.classList.add("errors-input");
    errorsInfo.innerHTML = "Formularz zawiera błędy";
  }else {
    removeErrorClass(element, error)
  }
}

function validateFormAddingProduct(event) {
  let messages = [];

  validateInput(messages, fieldProductName, nameREGEX, errorsProductName);
  validateInput(messages, fieldBrand, brandREGEX, errorsBrand);
  validateDescriptionInput(messages, fieldDescription, errorsDescription);
  validateNumberInput(messages, 1995, 2020, fieldYear, errorsYear);
  validateNumberInput(messages, 30, 50, fieldSize, errorsSize);

  if (messages.length > 0) {
    event.preventDefault();
    errorsSummary.innerHTML = messages.join('\n');
  }
  else{
    removeErrorClass(fieldYear, errorsYear);
    errorsInfo.innerHTML = "";
    errorsSummary.innerHTML = "";
  }
}

formAddingProduct.addEventListener('submit', validateFormAddingProduct);
