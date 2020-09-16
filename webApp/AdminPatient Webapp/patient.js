var received = null

serv = 'ok' //acts as server input
//details = 'Y'
//serv = none
function patientSignIn(){
  var patientID = document.getElementById('patient-id').value
  var patientName = document.getElementById('patient-name').value

  //checks if all the information is filled out
  if (patientID.length === 0 || patientName.length === 0){
      document.getElementById('msg').textContent = 'Empty fields detected. Please enter patient ID or name.' 
  }
  
  //send this sht to server

  //checks if information is present
  else if (serv === null){
    msg.textContent = 'Sorry patient not found. Please try again.'
  }
  //correct input
  else if (serv === 'ok'){
    msg.textContent = ''
    document.getElementById('login-box').classList.remove('login-box')
    document.getElementById('login-box').classList.add('login-box-patient')
    document.getElementById('submit1').classList.add('hide')

    var details = document.getElementById('details')
    var paraContainer = document.createElement('p')
    var paraMessage = document.createTextNode('Do you wish to accept any visitors currently?')
    paraContainer.append(paraMessage)
    details.append(paraContainer)

    document.getElementById('switch-container').classList.remove('hide')
    document.getElementById('submit2').classList.remove('hide')
    document.getElementById('submit2').classList.add('btn')
  }
}

//to be send to the server
function submitPaitent(){
  value = document.getElementById('switch-btn').checked
  console.log(value)
  alert('Changes made is successful!')
  window.location.href="https://a-1-test-1.rea123.repl.co/index.html" //update this
}