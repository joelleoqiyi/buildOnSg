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
  fetch('http://buildonsg-tracelet.us-east-1.elasticbeanstalk.com/login/staff', {
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
    .then((data) => {
      if (data.length > 0) {
        alert('lol')
      } else if (data.length == 0) {
        document.getElementById('msg').textContent = 'Sorry admin not found. Please try again.'
      }
    })
    .catch((err) => alert(`Oh no something went wrong! ${err}`))

}

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btn').addEventListener('click', submitAdmin);
})