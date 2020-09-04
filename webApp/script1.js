function sendReservationRequest() {
    fetch("http://buildonsg-tracelet.us-east-1.elasticbeanstalk.com/reservation", {
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
                    "bed": bed.value
                }
            )
    })
        .then((res) => res.json())
        .then((data) => {   
            displayContainer.classList.remove('hide');
            displayResult.innerText = `Your reservation is successful! Please take note of your Visiting ID: ${data.payload}`         ;
        })
        .catch((err) => {
            errorMessage.innerText = `Something went wrong. Please try again! Error Message: ${err}`;
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
const de1 = document.getElementById('y1');
const de2 = document.getElementById('y2');
const de3 = document.getElementById('y3');
const displayResult = document.getElementById('displayResult');
const errorMessage = document.getElementById('errorMsg');
const displayContainer = document.getElementById('displayContainer');


submitButton.addEventListener('click', () => {
        sendReservationRequest(); 
});
