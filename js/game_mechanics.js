const cover = document.getElementsByClassName("cover")[0];
let selectedCards = [];
let isProcessing = false;
let attemptsScore = 0;
let attempts = document.getElementById("attempts");
let currentLvl = 1;

function prepareCover(totalPairs) {
  let img = document.getElementById("gameImg");
  img.addEventListener("contextmenu", function () {
    event.preventDefault();
  });
  const totalCards = totalPairs * 2;
  const columns = Math.floor(Math.sqrt(totalCards));
  let rows = Math.ceil(totalCards / columns);

  if (columns * rows < totalCards) {
    rows++;
  }

  cover.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
  cover.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

  let cardsIcons = ["card1", "card2", "card3", "card4", "card5", "card6"];
  let pairs = [];

  for (let i = 0; i < totalPairs; i++) {
    let icon = cardsIcons[i % cardsIcons.length];
    pairs.push(icon);
    pairs.push(icon);
  }

  pairs = pairs.sort(() => 0.5 - Math.random());

  cover.innerHTML = "";
  for (let i = 0; i < totalCards; i++) {
    let card = document.createElement("div");
    card.className = "card";

    let front = document.createElement("div");
    front.className = "front";
    front.style.backgroundImage = "url(media/images/cards/starter.webp)";

    let back = document.createElement("div");
    back.className = "back";
    back.style.backgroundImage =
      "url(media/images/cards/" + pairs[i] + ".webp)";

    card.appendChild(front);
    card.appendChild(back);

    card.dataset.icon = pairs[i];

    card.addEventListener("click", function () {
      if (!isProcessing && !selectedCards.includes(card)) {
        revealCard(card);
      }
    });

    cover.appendChild(card);
  }
}

function revealCard(card) {
  if (isProcessing) return;

  isProcessing = true;

  card.classList.add("flipped");

  selectedCards.push(card);

  if (selectedCards.length === 2) {
    attemptsScore++;
    attempts.innerText = attemptsScore;

    if (selectedCards[0].dataset.icon === selectedCards[1].dataset.icon) {
      setTimeout(() => {
        selectedCards[0].classList.add("match");
        selectedCards[1].classList.add("match");
      }, 1000);

      setTimeout(() => {
        selectedCards[0].style.visibility = "hidden";
        selectedCards[1].style.visibility = "hidden";
        selectedCards = [];
        isProcessing = false;

        if (
          document.querySelectorAll(".card").length ===
          document.querySelectorAll(".card[style*='visibility: hidden']").length
        ) {
          win();
          unlockNext();
          getBtns();
          markAsComplete();
        }
      }, 1500);
    } else {
      setTimeout(() => {
        selectedCards[0].classList.remove("flipped");
        selectedCards[1].classList.remove("flipped");
        selectedCards = [];
        isProcessing = false;
      }, 1000);
    }
  } else {
    isProcessing = false;
  }
}

function win() {
  confetti({
    ...defaults,
    particleCount: 50,
    scalar: 2,
  });

  confetti({
    ...defaults,
    particleCount: 25,
    scalar: 3,
  });

  confetti({
    ...defaults,
    particleCount: 10,
    scalar: 4,
  });
}

const defaults = {
  spread: 360,
  ticks: 100,
  gravity: 0,
  decay: 0.94,
  startVelocity: 30,
  shapes: ["heart"],
  colors: ["FFC0CB", "FF69B4", "FF1493", "C71585"],
};

function unlockNext() {
  if (currentLvl != 15) {
    let nextLvl = document.getElementsByClassName("lvl" + (currentLvl + 1))[0];
    nextLvl.classList.remove("locked");
    currentLvl++;
  }
}

function handleLockedClick() {
  let alerted = document.getElementById("warning");
  if (alerted) {
    alerted.remove();
  }
  let alert = document.createElement("h2");
  alert.id = "warning";
  alert.innerText = "YOU MUST COMPLETE MORE LEVELS TO UNLOCK THIS LEVEL";
  let body = document.querySelector("body");
  let bodyref = document.querySelector("body").children[2];
  body.insertBefore(alert, bodyref);
}

function handleLvlClick(event) {
  let reward = document.getElementById("gameImg");
  let bg = document.querySelector("body");
  let rewards = [
    "media/images/reward/7image.png",
    "media/images/reward/6image.png",
    "media/images/reward/4image.png",
    "media/images/reward/3image.png",
    "media/images/reward/9image.png",
    "media/images/reward/11image.png",
    "media/images/reward/13image.png",
    "media/images/reward/16image.png",
    "media/images/reward/17image.png",
    "media/images/reward/18image.png",
    "media/images/reward/23image.png",
    "media/images/reward/26image.png",
    "media/images/reward/29image.png",
    "media/images/reward/30image.png",
  ];

  let bgs = [
    "url(media/images/side/1image.png)",
    "url(media/images/side/1image.png)",
    "url(media/images/side/2image.png)",
    "url(media/images/side/2image.png)",
    "url(media/images/side/19image.png)",
    "url(media/images/side/19image.png)",
    "url(media/images/side/19image.png)",
    "url(media/images/side/14image.png)",
    "url(media/images/side/20image.png)",
    "url(media/images/side/20image.png)",
    "url(media/images/side/20image.png)",
    "url(media/images/side/24image.png)",
    "url(media/images/side/25image.png)",
    "url(media/images/side/25image.png)",
  ];

  let lvlsSelect = [1, 2, 1, 2, 2, 3, 3, 2, 1, 2, 3, 3, 1, 2];

  reward.src = rewards[event.target.innerText - 1];
  bg.style.backgroundImage = bgs[event.target.innerText - 1];
  prepareLvl(lvlsSelect[event.target.innerText - 1], event.target.innerText);

  let alerted = document.getElementById("warning");
  if (alerted) {
    alerted.remove();
  }
}

document.addEventListener("click", function (event) {
  if (!event.target.closest(".lvl")) {
    let alerted = document.getElementById("warning");
    if (alerted) {
      alerted.remove();
    }
  }
});

function getBtns() {
  let lvlsBtns = document.querySelectorAll(".lvl");

  lvlsBtns.forEach((btn) => {
    btn.removeEventListener("click", handleLockedClick);
    btn.removeEventListener("click", handleLvlClick);

    if (btn.classList.contains("locked")) {
      btn.addEventListener("click", handleLockedClick);
    } else {
      btn.addEventListener("click", handleLvlClick);
    }
  });
}

prepareLvl(1, 1);
getBtns();

function prepareLvl(lvl, n) {
  attemptsScore = 0;
  attempts.innerText = attemptsScore;
  let lvlNumber = document.getElementById("lvlnumber");
  lvlNumber.innerText = n;
  let img = document.getElementById("gameImg");
  const difficulty = document.getElementById("diff");
  const lace = document.createElement("img");
  if (lvl == 1) {
    prepareCover(8);
    lace.src = "media/images/diff1.webp";
    difficulty.innerHTML = "";
    difficulty.appendChild(lace);
  } else if (lvl == 2) {
    prepareCover(18);
    lace.src = "media/images/diff2.png";
    difficulty.innerHTML = "";
    difficulty.appendChild(lace);
  } else if (lvl == 3) {
    prepareCover(28);
    lace.src = "media/images/diff3.png";
    difficulty.innerHTML = "";
    difficulty.appendChild(lace);
  }

  let lvlSelector = document.querySelector(".lvl" + n);
  if (lvlSelector.classList.contains("complete")) {
    addRevealButton();
  } else {
    removeRevealButton();
  }
}

function markAsComplete() {
  let lvlSelector = document.querySelector(".lvl" + (currentLvl - 1));
  lvlSelector.classList.add("complete");
  lvlSelector.style.borderColor = "deeppink";
  lvlSelector.style.color = "deeppink";
}

function addRevealButton() {
  if (document.getElementById("revealBtn")) {
    return;
  }

  const revealBtn = document.createElement("h2");
  revealBtn.innerText = "Reveal";
  revealBtn.id = "revealBtn";

  revealBtn.addEventListener("click", () => {
    revealHiddenCards();
  });

  document.querySelector(".bot").appendChild(revealBtn);
}

function revealHiddenCards() {
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    card.style.visibility = "hidden";
  });
}

function removeRevealButton() {
  const revealBtn = document.getElementById("revealBtn");
  if (revealBtn) {
    revealBtn.remove();
  }
}

const audio = document.getElementById("audio");
const controlButton = document.getElementById("playButton");
let audioImage = controlButton.children[0];

controlButton.addEventListener("click", function () {
  if (audio.paused) {
    audio.muted = false;
    audio.play();
    audioImage.src = "media/images/music-on.png";
  } else {
    audio.muted = !audio.muted;
    audioImage.src = audio.muted
      ? "media/images/music-off.png"
      : "media/images/music-on.png";
  }
});

const infoBtn = document.getElementById("info");
const infoShield = document.querySelector(".info_shield");
const infoMenu = document.querySelector(".info_menu");
infoBtn.addEventListener("click", function () {
  infoShield.style.display = "flex";
});

infoShield.addEventListener("click", function (event) {
  if (!event.target.closest(".info_menu")) {
    infoShield.style.display = "none";
  }
});
