function sendDeclarationRequest() {
    fetch("http://buildonsg-tracelet.us-east-1.elasticbeanstalk.com/healthdeclaration", {
        "method": "POST",
        "headers": {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(
                {
                    "date": visitingDate.value,
                    "firstName": firstName.value,
                    "lastName": lastName.value,
                    "nric": NRIC.value,
                    "email": email.value,
                    "relationship": relationship.value,
                    "address": address.value,
                    "patientFirstName": patientFirstName.value,
                    "patientLastName": patientLastName.value,
                    "ward": ward.value,
                    "bed": bed.value,
                    "de1": de1.checked,
                    "de2": de2.checked,
                    "de3": de3.checked,
                    "id": giveMeVal('id')
                }
            )
    })
        .then((res) => res.blob())
        .then((data) => {            
            const urlCreator = window.URL || window.webkitURL;
            displayImage.src = urlCreator.createObjectURL(data);
            displayContainer.classList.remove('hide');
            console.log('image is displaying');
        })
        .catch((err) => {
            errorMessage.innerText = `Something went wrong. Please try again! Error Message: ${err}`;
        })

        console.log({
            "date": visitingDate.value,
            "firstName": firstName.value,
            "lastName": lastName.value,
            "nric": NRIC.value,
            "email": email.value,
            "relationship": relationship.value,
            "address": address.value,
            "patientFirstName": patientFirstName.value,
            "patientLastName": patientLastName.value,
            "ward": ward.value,
            "bed": bed.value,
            "de1": de1.checked,
            "de2": de2.checked,
            "de3": de3.checked,
            "id": giveMeVal('id')
        })
}


function giveMeVal(name) {
    const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
    const url = window.location.href;
    const results = regex.exec(url)
    if (!results || !results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

const submitButton = document.getElementById('submit');
const firstName = document.getElementById('fname');
const lastName = document.getElementById('lname');
const NRIC = document.getElementById('nric');
const relationship = document.getElementById('rs');
const email = document.getElementById('email');
const address = document.getElementById('address');
const patientFirstName = document.getElementById('pfname');
const patientLastName = document.getElementById('plname');
const ward = document.getElementById('ward');
const bed = document.getElementById('bed');
const visitingDate = document.getElementById('date');
const de1 = document.getElementById('n1');
const de2 = document.getElementById('n2');
const de3 = document.getElementById('n3');
const displayImage = document.getElementById('image');
const errorMessage = document.getElementById('errorMsg');
const displayContainer = document.getElementById('displayContainer');

// setting the values based on the url
function setup() {
    firstName.value = giveMeVal('fn');
    lastName.value = giveMeVal('ln');
    NRIC.value = giveMeVal('nric');
    relationship.value = giveMeVal('rs');
    email.value = giveMeVal('e').replace(/\-+/g, '.').replace(/_+/, '@');
    address.value = giveMeVal('a').replace(/\-+/g, ' ');
    patientFirstName.value = giveMeVal('pfn');
    patientLastName.value = giveMeVal('pln');
    ward.value = giveMeVal('pw');
    bed.value = giveMeVal('pb');
    visitingDate.value = giveMeVal('d');
}

submitButton.addEventListener('click', () => {
    if (de1.checked && de2.checked && de3.checked){
        sendDeclarationRequest(); 
    } else {
        alert("You have not declared!")
    }
});

setup()