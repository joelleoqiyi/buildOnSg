serv = 'Y'

// this happens when user presses 'sign in'
function submitAdmin(){
  //alert('cool')
  adminUser = document.getElementById('admin-user').value
  adminPassword = document.getElementById('admin-password').value
  console.log(adminUser + adminPassword)

  //checks if all the information is filled out
  if (adminUser.length === 0 || adminPassword.length === 0){
    document.getElementById('msg').textContent = 'Empty fields detected. Please enter patient ID or name.' 
  }

  //send the sht to server

  if (serv == 'N'){
    document.getElementById('msg').textContent = 'Incorrect userID or password. Please try again.'
  }
  else{
    window.location.href="https://a-1-test-1.rea123.repl.co/template.html"
  }

}