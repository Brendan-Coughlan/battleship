const LOCAL_PLAY_URL = "./index.html";

const playBtn = document.getElementById("playBtn");
const rulesBtn = document.getElementById("rulesBtn");
const overlay = document.getElementById("overlay");
const closeBtn = document.getElementById("closeBtn");

playBtn.addEventListener("click", () => {
  window.location.href = LOCAL_PLAY_URL;
});

const openRules = () => overlay.classList.add("open");
const closeRules = () => overlay.classList.remove("open");

rulesBtn.addEventListener("click", openRules);
closeBtn.addEventListener("click", closeRules);

overlay.addEventListener("click", (e) => {
  if (e.target === overlay) closeRules();
});

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && overlay.classList.contains("open")) closeRules();
});
