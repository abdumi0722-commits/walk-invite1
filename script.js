document.addEventListener("DOMContentLoaded", () => {
  const particlesContainer = document.getElementById("particles");
  const fallingFlowersContainer = document.getElementById("fallingFlowers");
  const giftWrapper = document.getElementById("giftWrapper");
  const giftBox = document.getElementById("giftBox");
  const musicPlayer = document.getElementById("musicPlayer");
  const inviteCard = document.getElementById("inviteCard");

  // Аудиоплеер (файл music.mp3 кладем в папку проекта)
  const bgMusic = document.getElementById("bgMusic");
  const playPauseBtn = document.getElementById("playPauseBtn");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const coverArt = document.getElementById("coverArt");
  const progressContainer = document.getElementById("progressContainer");
  const progressBar = document.getElementById("progressBar");
  const progressThumb = document.getElementById("progressThumb");

  const yesBtn = document.getElementById("yesBtn");
  const noBtn = document.getElementById("noBtn");

  // 1. Мерцающие точки на фоне
  for (let i = 0; i < 34; i++) {
    const dot = document.createElement("div");
    dot.className = "particle";
    dot.style.left = `${Math.random() * 100}%`;
    dot.style.top = `${Math.random() * 100}%`;
    dot.style.animationDelay = `${Math.random() * 3}s`;
    particlesContainer.appendChild(dot);
  }

  // 2. Генерация крупных падающих цветочков по всему экрану
  const flowerIcons = ["🌸", "🌺", "🌼", "🌷", "🌹", "💐"];
  let flowerRainInterval = null;

  function spawnFlower(large = true) {
    const flower = document.createElement("span");
    flower.className = "falling-flower";
    flower.textContent = flowerIcons[Math.floor(Math.random() * flowerIcons.length)];

    const size = large
      ? Math.floor(Math.random() * 25) + 34
      : Math.floor(Math.random() * 18) + 26;
    const duration = (Math.random() * 2.6 + 3.2).toFixed(2);
    const drift = `${Math.floor(Math.random() * 140 - 70)}px`;
    const spin = `${Math.random() > 0.5 ? "" : "-"}${Math.floor(Math.random() * 360 + 180)}deg`;

    flower.style.left = `${Math.random() * 96}%`;
    flower.style.fontSize = `${size}px`;
    flower.style.animationDuration = `${duration}s`;
    flower.style.setProperty("--drift", drift);
    flower.style.setProperty("--spin", spin);

    fallingFlowersContainer.appendChild(flower);

    setTimeout(() => {
      flower.remove();
    }, Number(duration) * 1000 + 200);
  }

  function startFlowerShower() {
    for (let i = 0; i < 24; i++) {
      setTimeout(() => spawnFlower(true), i * 90);
    }

    if (!flowerRainInterval) {
      flowerRainInterval = setInterval(() => {
        spawnFlower(true);
      }, 420);
    }
  }

  // 3. Открытие подарка, запуск музыки и цветочков
  let isOpened = false;

  function updatePlayerUI(isPlaying) {
    if (isPlaying) {
      playPauseBtn.textContent = "❚❚";
      coverArt.classList.add("playing");
    } else {
      playPauseBtn.textContent = "▶";
      coverArt.classList.remove("playing");
    }
  }

  giftWrapper.addEventListener("click", () => {
    if (isOpened) return;
    isOpened = true;

    giftBox.classList.add("opened");
    startFlowerShower();

    bgMusic.play().then(() => {
      updatePlayerUI(true);
    }).catch(() => {
      updatePlayerUI(false);
    });

    setTimeout(() => {
      musicPlayer.classList.remove("hidden");
    }, 400);

    setTimeout(() => {
      document.body.classList.add("flash-bg");
      giftWrapper.classList.add("fade-out");
    }, 1350);

    setTimeout(() => {
      document.body.classList.remove("flash-bg");
      giftWrapper.style.display = "none";
      inviteCard.classList.remove("hidden");
    }, 1900);
  });

  // 4. Кнопки и шкала плеера
  playPauseBtn.addEventListener("click", () => {
    if (bgMusic.paused) {
      bgMusic.play().then(() => updatePlayerUI(true)).catch(() => updatePlayerUI(false));
    } else {
      bgMusic.pause();
      updatePlayerUI(false);
    }
  });

  prevBtn.addEventListener("click", () => {
    bgMusic.currentTime = 0;
  });

  nextBtn.addEventListener("click", () => {
    if (!bgMusic.duration) return;
    bgMusic.currentTime = Math.min(bgMusic.duration, bgMusic.currentTime + 10);
  });

  bgMusic.addEventListener("timeupdate", () => {
    if (!bgMusic.duration) return;
    const percent = (bgMusic.currentTime / bgMusic.duration) * 100;
    progressBar.style.width = `${percent}%`;
    progressThumb.style.left = `${percent}%`;
  });

  progressContainer.addEventListener("click", (e) => {
    if (!bgMusic.duration) return;
    const rect = progressContainer.getBoundingClientRect();
    const clickX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    bgMusic.currentTime = (clickX / rect.width) * bgMusic.duration;
  });

  // 5. Кнопка "Нет" убегает и исчезает, а "Да" растет
  let noClicks = 0;
  const maxAttempts = 6;
  let yesScale = 1;

  const noPhrases = [
    "Точно нет?",
    "Подумай еще 😉",
    "Там очень красиво!",
    "Не туда жмешь 😄",
    "Почти поймала!",
    "Осталась только Да ❤️"
  ];

  function dodgeNoButton() {
    noClicks++;

    yesScale += 0.22;
    yesBtn.style.transform = `scale(${yesScale})`;

    if (noClicks >= maxAttempts) {
      noBtn.style.opacity = "0";
      noBtn.style.pointerEvents = "none";
      setTimeout(() => {
        noBtn.remove();
      }, 300);
      return;
    }

    noBtn.textContent = noPhrases[noClicks - 1] || "Нет";
    const noScale = Math.max(0.55, 1 - noClicks * 0.08);
    noBtn.style.opacity = `${Math.max(0.35, 1 - noClicks * 0.12)}`;

    noBtn.style.position = "fixed";
    const padding = 24;
    const maxX = window.innerWidth - noBtn.offsetWidth - padding;
    const maxY = window.innerHeight - noBtn.offsetHeight - padding;

    const randomX = Math.max(padding, Math.floor(Math.random() * maxX));
    const randomY = Math.max(padding, Math.floor(Math.random() * maxY));

    noBtn.style.left = `${randomX}px`;
    noBtn.style.top = `${randomY}px`;
    noBtn.style.transform = `scale(${noScale})`;
  }

  noBtn.addEventListener("click", (e) => {
    e.preventDefault();
    dodgeNoButton();
  });
});