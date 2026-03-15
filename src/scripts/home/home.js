const LOCAL_PLAY_URL = "./index.html?mode=local";
const AI_PLAY_URL = "./index.html?mode=ai";

const playBtn = document.getElementById("playBtn");
const playWithAIBtn = document.getElementById("playWithAI");
const rulesBtn = document.getElementById("rulesBtn");
const overlay = document.getElementById("overlay");
const closeBtn = document.getElementById("closeBtn");

const menuBg = document.getElementById("menuBg");
const actions = document.querySelector(".actions");
const bgButtons = document.querySelectorAll(".btn[data-bg]");

// click local play
playBtn.addEventListener("click", () => {
  window.location.href = LOCAL_PLAY_URL;
});

// click play with AI
playWithAIBtn.addEventListener("click", () => {
  window.location.href = AI_PLAY_URL;
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

function showMenuBackground(imageUrl) {
  menuBg.style.backgroundImage = `url("${imageUrl}")`;
  menuBg.classList.add("show");
}

function hideMenuBackground() {
  menuBg.classList.remove("show");
}

bgButtons.forEach((button) => {
  button.addEventListener("mouseenter", () => {
    showMenuBackground(button.dataset.bg);
  });
});

playBtn.addEventListener("mouseleave", hideMenuBackground);
playWithAIBtn.addEventListener("mouseleave", hideMenuBackground);
