const formAddingAuction = document.getElementById('formAddingAuction');
/* ADDING PRODUCT */
const fieldPriceNow = document.getElementById("priceNow");
const errorsPriceNow = document.getElementById("errors_priceNow");
const fieldDateEnd = document.getElementById("dateEnd");
const errorsDateEnd = document.getElementById("errors_dateEnd");
const fieldDescription = document.getElementById("description");
const errorsDescription = document.getElementById("errors_description");
const errorsInfo = document.getElementById('errors_info');
const errorsSummary = document.getElementById('errors_summary');


var errorMessages = {
    priceNow: "Pole 'Cena początkowa' jest wymagane",
    dateEnd: "Pole 'Data zakończenia' jest wymagane",
    description: "Pole 'Opis' jest wymagane"
};

var patternMessages = {
    priceNow: "Pole 'Cena początkowa' musi być dodatnia",
    dateEnd: "Pole 'dateEnd' min. tydzień od dzisiejszej daty",
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

function validateDateInput(messages,element, error) {
    if(!element.value.trim()){
        messages.push(errorMessages[element.getAttribute('id')]);
        error.innerHTML = errorMessages[element.getAttribute('id')];
        element.classList.add("errors-input");
        errorsInfo.innerHTML = "Formularz zawiera błędy";
    } else {
        removeErrorClass(element, error);
    };
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

function validateNumberInput(messages, element, error){
    if(!element.value.trim()){
        messages.push(errorMessages[element.getAttribute('id')]);
        error.innerHTML = errorMessages[element.getAttribute('id')];
        element.classList.add("errors-input");
        errorsInfo.innerHTML = "Formularz zawiera błędy";
    } else if(element.value.trim() && element.value < 0){
        messages.push(errorMessages[element.getAttribute('id')]);
        error.innerHTML = patternMessages[element.getAttribute('id')];
        element.classList.add("errors-input");
        errorsInfo.innerHTML = "Formularz zawiera błędy";
    }else {
        removeErrorClass(element, error)
    }
}


function validateFormAddingAuction(event) {
    let messages = [];
    validateDateInput(messages, fieldDateEnd, errorsDateEnd);
    validateDescriptionInput(messages, fieldDescription, errorsDescription);
    validateNumberInput(messages,  fieldPriceNow, errorsPriceNow);

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

formAddingAuction.addEventListener('submit', validateFormAddingAuction);
