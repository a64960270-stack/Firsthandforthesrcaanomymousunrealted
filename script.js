// Google Apps Script Web App URL
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxQ2YXb42mo2PM51J1Obq-2Nf4Xg2FudxQ1u0B5xW5MtVeVUWDHTHEI8SriM1v-G6dU/exec";

let selectedCandidate = null;

// Prevent double voting
if (localStorage.getItem("voted")) {
  document.body.innerHTML = "<h2 style='text-align:center;margin-top:100px;'>You have already submitted a response.</h2>";
}

// Select candidate
function selectCandidate(name) {
  selectedCandidate = name;
  document.querySelectorAll('.card').forEach(c => c.classList.remove('selected'));
  event.currentTarget.classList.add('selected');
}

// Image modal
document.querySelectorAll('.card img').forEach(img => {
  img.addEventListener('click', function(event) {
    event.stopPropagation(); // prevent selecting candidate when opening modal
    document.getElementById('photoModal').style.display = "block";
    document.getElementById('modalImg').src = this.src;
  });
});

function closeModal() {
  document.getElementById('photoModal').style.display = "none";
}

// Submit vote
function submitVote() {
  const message = document.getElementById("message").value;

  if (!selectedCandidate) {
    alert("Please select a candidate");
    return;
  }

  fetch(SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify({
      campus: "Anonymous",
      candidate: selectedCandidate,
      message
    })
  })
  .then(() => {
    localStorage.setItem("voted", "yes");
    document.getElementById("status").innerText =
      "Thank you. Your response has been recorded.";
  })
  .catch(() => {
    document.getElementById("status").innerText =
      "There was an error submitting your vote. Try again.";
  });
}