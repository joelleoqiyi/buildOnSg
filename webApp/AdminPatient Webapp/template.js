// document.getElementById('title1').value = 'COVID-19 ADVISORY'

// document.getElementById('para1').value = 'Farrer Park Hospital understands there might still be concerns about stepping into a medical facility. As we enter the post-circuit breaker period, your health remains our priority and our Hospital is committed to keeping you safe.'
// document.getElementById('para1').style.height = document.getElementById('para1').scrollHeight + 'px';

// document.getElementById('para2').value = 'With the number of permitted medical elective procedures increasing, some of you may have plans to resume your sessions with our specialists or make a new appointment.'
// document.getElementById('para2').style.height = document.getElementById('para2').scrollHeight + 'px';

// document.getElementById('para3').value = 'In this advisory, you will find useful information on the latest guidelines and measures we have adopted to make your visit safe and pleasant. Access the latest health educational materials with inputs by our panel of Infectious Diseases experts.'
// document.getElementById('para3').style.height = document.getElementById('para3').scrollHeight + 'px';

// document.getElementById('para4').value = 'To learn more, send in an enquiry here.'
// document.getElementById('para4').style.height = document.getElementById('para4').scrollHeight + 'px';

// document.getElementById('para5').value = 'Maximum of THREE (3) caregivers or visitors allowed per patient.'
// document.getElementById('para5').style.height = document.getElementById('para5').scrollHeight + 'px';

// document.getElementById('para6').value = 'Only ONE (1) visitor allowed in the ICU (East Wing) at any one time*'
// document.getElementById('para6').style.height = document.getElementById('para6').scrollHeight + 'px';

// //document.getElementById('para7').value = 'Our visiting hours are as follows:'
// document.getElementById('para7').style.height = document.getElementById('para7').scrollHeight + 'px';


      
function autoResize() {
  this.style.height = 'auto'; 
  this.style.height = this.scrollHeight + 'px'; 
} 

function addDomListener() {
  textarea = document.querySelectorAll(".autoresizing"); 
  textarea.forEach((t) => {
      t.addEventListener('input', autoResize, false); 
    }
  )

  updates = document.querySelectorAll('.snapshotPara');
  updates.forEach((u) => {
    u.addEventListener('change', (e) => {
      console.log('hmm')
      e.target.innerHTML = e.target.value;
    })
  })
}


var count = 8

function start(){

  fetch("http://localhost:3000/snapshot/REQ", {
        "method": "POST",
        "headers": {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(
                {
                    "id": "93klefuw8"
                }
            )
    })
        .then((res) => res.text())
        .then((data) => {
          document.getElementById('view').innerHTML = data;
          addDomListener();
        })
        .catch((err) => {
            alert(`Something went wrong. Please try again! Error Message: ${err}`);
        })

  document.getElementById('publish').addEventListener('click', function(){
    const snapshot_view = document.getElementById('view').innerHTML;
    console.log(snapshot_view)
    fetch("http://localhost:3000/snapshot/UPDATE", {
        "method": "POST",
        "headers": {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(
                {
                    "id": "93klefuw8",
                    "snapshot": String(snapshot_view)
                }
            )
    })
        .then((res) => res.text())
        .then((data) => {
          alert(data)
          addDomListener();
        })
        .catch((err) => {
            alert(`Something went wrong. Please try again! Error Message: ${err}`);
        })
  })

  document.getElementById('paragraph').addEventListener('click', function(){
    var contentContainer = document.getElementById('contentview')
    var content = document.createElement('textarea')
    content.setAttribute('class', 'para-view autoresizing snapshotPara')
    content.setAttribute('wrap', 'soft')
    content.setAttribute('id', 'para'+String(count))
    content.value = 'Click to edit this text box.'
    var div = document.createElement('div')
    div.append(content)
    contentContainer.append(div)
    addDomListener();
  })


}
