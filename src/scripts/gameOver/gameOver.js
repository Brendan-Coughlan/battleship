const params = new URLSearchParams(window.location.search);
const winner = params.get("winner");

// subtitle text
const resultText = document.getElementById("resultText");
// start a new game button
const newGameBtn = document.getElementById("newGameBtn");
// return to home page button
const homeBtn = document.getElementById("homeBtn");

if (winner) {
  resultText.textContent = `Player ${winner} wins! 🎉`;
} else {
  resultText.textContent = "Game Over";
}

// Redirect to new game page
newGameBtn.addEventListener("click", () => {
  window.location.href = "./index.html"; 
});

// Redirect to home page
homeBtn.addEventListener("click", () => {
  window.location.href = "./homePage.html";
});