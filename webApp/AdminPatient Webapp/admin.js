serv = 'Y'

// this happens when user presses 'sign in'
function submitAdmin(){
  //alert('cool')
  adminUser = document.getElementById('admin-user').value
  adminPassword = document.getElementById('admin-password').value

  //checks if all the information is filled out
  if (adminUser.length === 0 || adminPassword.length === 0){
    document.getElementById('msg').textContent = 'Empty fields detected. Please enter patient ID or name.'
    return; 
  }

  //send the sht to server
  fetch('http://localhost:3000/login/staff', {
    "method": "POST",
    "headers": {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(
      {
        "username": adminUser,
        "password": adminPassword
      }
    )
  })
    .then((res) => res.json())
    .then((data) => console.log(data))
    .catch((err) => alert(`Oh no something went wrong! ${err}`))

  // if (serv == 'N'){
  //   document.getElementById('msg').textContent = 'Incorrect userID or password. Please try again.'
  // }
  // else{
  //   window.location.href="https://a-1-test-1.rea123.repl.co/template.html"
  // }

}