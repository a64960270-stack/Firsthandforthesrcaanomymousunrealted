// Google Apps Script Web App URL
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxQ2YXb42mo2PM51J1Obq-2Nf4Xg2FudxQ1u0B5xW5MtVeVUWDHTHEI8SriM1v-G6dU/exec";

let selectedCandidate = null;
let submitting = false;

// Prevent double voting on page load
if (localStorage.getItem("voted")) {
  document.body.innerHTML =
    "<h2 style='text-align:center;margin-top:100px;'>You have already submitted a response.</h2>";
}

// Select candidate
function selectCandidate(name) {
  selectedCandidate = name;
  document.querySelectorAll('.card').forEach(c => c.classList.remove('selected'));
  event.currentTarget.classList.add('selected');
}

// Image modal
document.querySelectorAll('.card img').forEach(img => {
  img.addEventListener('click', function (event) {
    event.stopPropagation();
    document.getElementById('photoModal').style.display = "block";
    document.getElementById('modalImg').src = this.src;
  });
});

function closeModal() {
  document.getElementById('photoModal').style.display = "none";
}

// Submit vote (LOCKED & SAFE)
function submitVote() {

  // 🔒 Block repeat attempts instantly
  if (localStorage.getItem("voted") || submitting) {
    alert("You have already submitted a response.");
    return;
  }

  if (!selectedCandidate) {
    alert("Please select a candidate");
    return;
  }

  submitting = true;
  localStorage.setItem("voted", "yes"); // lock immediately

  const btn = document.querySelector("button");
  btn.disabled = true;
  btn.innerText = "Submitting...";

  const message = document.getElementById("message").value;

  fetch(SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify({
      campus: "Anonymous",
      candidate: selectedCandidate,
      message: message
    })
  })
    .then(() => {
      document.getElementById("status").innerText =
        "Thank you. Your response has been recorded.";
      btn.innerText = "Submitted";
    })
    .catch(() => {
      // rollback only if submission fails
      submitting = false;
      localStorage.removeItem("voted");
      btn.disabled = false;
      btn.innerText = "Submit Vote";

      document.getElementById("status").innerText =
        "There was an error submitting your vote. Try again.";
    });
}
