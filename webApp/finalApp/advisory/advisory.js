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
    u.setAttribute('ReadOnly', 'true')
})
}

window.addEventListener('DOMContentLoaded', (event) => {
    fetch("http://buildonsg-tracelet.us-east-1.elasticbeanstalk.com/snapshot/REQ", {
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
})
