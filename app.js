document.addEventListener("DOMContentLoaded", () => {
  const cfg = WEDDING_CONFIG;
  const $ = (selector) => document.querySelector(selector);

  // ---------- Helpers ----------
  const setText = (selector, value) => {
    const el = $(selector);
    if (el) el.textContent = value ?? "";
  };

  const setImageBackground = (selector, src) => {
    const el = $(selector);
    if (el && src) el.style.backgroundImage = `url("${src}")`;
  };

  // ---------- Populate ----------
  document.title = `${cfg.couple.groom} & ${cfg.couple.bride} — Wedding Invitation`;

  setText("#coverEyebrow", cfg.cover.eyebrow);
  setText("#coverTitle", cfg.cover.title || `${cfg.couple.groom} ${cfg.couple.separator} ${cfg.couple.bride}`);
  setText("#coverDate", cfg.date.display);
  setText("#openButtonText", cfg.cover.buttonText);

  setText("#inviteNames", `${cfg.couple.groom} ${cfg.couple.separator} ${cfg.couple.bride}`);
  setText("#inviteSubtitle", cfg.couple.subtitle);
  setText("#lunarDate", cfg.date.lunar);

  setText("#groomName", cfg.couple.groom);
  setText("#brideName", cfg.couple.bride);

  setText("#storyTitle", cfg.story.title);
  setText("#storyText", cfg.story.text);

  setText("#eventTitle", cfg.event.title);
  setText("#eventTime", cfg.event.time);
  setText("#eventDate", cfg.event.date);
  setText("#eventVenue", cfg.event.venue);
  setText("#eventAddress", cfg.event.address);
  $("#mapButton").href = cfg.event.mapUrl;

  setText("#footerMessage", cfg.footer.message);
  setText("#signature", `${cfg.couple.groom} ${cfg.couple.separator} ${cfg.couple.bride}`);

  setImageBackground("#hero", cfg.cover.image);
  setImageBackground(".groom-photo", cfg.groomImage || "assets/images/groom.svg");
  setImageBackground(".bride-photo", cfg.brideImage || "assets/images/bride.svg");

  // ---------- Music ----------
  const music = $("#weddingMusic");
  const musicButton = $("#musicButton");
  if (cfg.music?.enabled && cfg.music.src) {
    music.src = cfg.music.src;
  } else {
    musicButton.style.display = "none";
  }

  async function toggleMusic() {
    if (!cfg.music?.enabled || !music.src) return;
    if (music.paused) {
      try {
        await music.play();
        musicButton.classList.add("playing");
      } catch (e) {
        console.warn("Không thể tự phát nhạc:", e);
      }
    } else {
      music.pause();
      musicButton.classList.remove("playing");
    }
  }
  musicButton.addEventListener("click", toggleMusic);

  $("#openInvitation").addEventListener("click", async () => {
    document.body.classList.remove("locked");
    await toggleMusic();
    $("#invitation")?.scrollIntoView({ behavior: "smooth" });
    document.querySelector(".invitation").scrollIntoView({ behavior: "smooth" });
  });

  // ---------- Countdown ----------
  const target = new Date(cfg.date.iso).getTime();
  const units = {
    days: document.querySelector('[data-unit="days"]'),
    hours: document.querySelector('[data-unit="hours"]'),
    minutes: document.querySelector('[data-unit="minutes"]'),
    seconds: document.querySelector('[data-unit="seconds"]')
  };

  function updateCountdown() {
    const distance = target - Date.now();
    if (distance <= 0) {
      Object.values(units).forEach(el => el.textContent = "00");
      return;
    }
    const days = Math.floor(distance / 86400000);
    const hours = Math.floor(distance / 3600000) % 24;
    const minutes = Math.floor(distance / 60000) % 60;
    const seconds = Math.floor(distance / 1000) % 60;
    units.days.textContent = String(days).padStart(2, "0");
    units.hours.textContent = String(hours).padStart(2, "0");
    units.minutes.textContent = String(minutes).padStart(2, "0");
    units.seconds.textContent = String(seconds).padStart(2, "0");
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ---------- Gallery ----------
  const gallery = $("#gallery");
  let currentImage = 0;

  cfg.gallery.forEach((src, index) => {
    const item = document.createElement("figure");
    item.className = "gallery-item reveal";
    const img = document.createElement("img");
    img.src = src;
    img.alt = `Ảnh cưới ${index + 1}`;
    img.loading = "lazy";
    item.appendChild(img);
    item.addEventListener("click", () => openLightbox(index));
    gallery.appendChild(item);
  });

  const lightbox = $("#lightbox");
  const lightboxImage = $("#lightboxImage");

  function openLightbox(index) {
    currentImage = index;
    lightboxImage.src = cfg.gallery[currentImage];
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
  }
  function closeLightbox() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
  }
  function moveLightbox(direction) {
    currentImage = (currentImage + direction + cfg.gallery.length) % cfg.gallery.length;
    lightboxImage.src = cfg.gallery[currentImage];
  }

  $("#lightboxClose").addEventListener("click", closeLightbox);
  $("#lightboxPrev").addEventListener("click", () => moveLightbox(-1));
  $("#lightboxNext").addEventListener("click", () => moveLightbox(1));
  lightbox.addEventListener("click", e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener("keydown", e => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") moveLightbox(-1);
    if (e.key === "ArrowRight") moveLightbox(1);
  });

  // ---------- Gift ----------
  if (!cfg.gift?.enabled) {
    $("#giftSection").style.display = "none";
  } else {
    setText("#giftBank", cfg.gift.bank);
    setText("#giftOwner", cfg.gift.owner);
    setText("#giftAccount", cfg.gift.account);
    $("#giftQr").src = cfg.gift.qr;

    $("#copyAccount").addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(cfg.gift.account);
        setText("#copyStatus", "Đã sao chép số tài khoản");
        setTimeout(() => setText("#copyStatus", ""), 2200);
      } catch {
        setText("#copyStatus", "Không thể tự sao chép trên trình duyệt này");
      }
    });
  }

  // ---------- Scroll reveal ----------
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

  // ---------- Loader ----------
  window.setTimeout(() => $("#loader").classList.add("hidden"), 450);
});
