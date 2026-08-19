(function () {
  "use strict";

  var config = window.VALENTINE_CONFIG;
  var musicButton = document.querySelector(".music");
  var musicIcon = musicButton.querySelector(".music-close");
  var musicHint = document.getElementById("music-hint");
  var audio = document.querySelector(".audio");
  var image = document.getElementById("current-img");
  var caption = document.getElementById("photo-caption");
  var photoDate = document.getElementById("photo-date");
  var carouselButton = document.querySelector(".carousel-toggle");
  var dots = document.querySelector(".gallery-dots");
  var themePicker = document.querySelector(".theme-picker");
  var dialog = document.querySelector(".photo-dialog");
  var dialogImage = document.getElementById("dialog-image");
  var dialogCaption = document.getElementById("dialog-caption");
  var dialogDate = document.getElementById("dialog-date");
  var posterDialog = document.querySelector(".poster-dialog");
  var posterCanvas = document.querySelector(".poster-preview");
  var posterContext = posterCanvas.getContext("2d");
  var posterSize = document.querySelector(".poster-size");
  var posterTheme = document.querySelector(".poster-theme");
  var posterColor = document.querySelector(".poster-color");
  var posterDate = document.querySelector(".poster-date");
  var posterMessage = document.querySelector(".poster-message");
  var posterUsePhoto = document.querySelector(".poster-use-photo");
  var posterStatus = document.querySelector(".poster-status");
  var posterMessageCount = document.querySelector(".poster-message-count");
  var posterActions = document.querySelector(".poster-actions");
  var posterPreviewWrap = document.querySelector(".poster-preview-wrap");
  var posterPhotoPicker = document.querySelector(".poster-photo-picker");
  var posterControls = document.querySelector(".poster-controls");
  var downloadPosterButton = document.querySelector(".download-poster");
  var sharePosterButton = document.querySelector(".share-poster");
  var accessGate = document.querySelector(".access-gate");
  var accessForm = document.querySelector(".access-form");
  var accessPassword = document.getElementById("access-password");
  var accessCopy = document.getElementById("access-copy");
  var accessStatus = document.querySelector(".access-status");
  var wishlist = document.getElementById("wishlist");
  var wishlistForm = document.querySelector(".wishlist-form");
  var wishlistTitle = document.getElementById("wishlist-title");
  var wishlistCategory = document.getElementById("wishlist-category");
  var wishlistStatus = document.querySelector(".wishlist-status");
  var memoryMap = document.getElementById("memory-map");
  var placeDetail = document.getElementById("place-detail");
  var moodCalendar = document.getElementById("mood-calendar");
  var calendarMonth = document.getElementById("calendar-month");
  var moodForm = document.getElementById("mood-form");
  var moodDate = document.getElementById("mood-date");
  var moodValue = document.getElementById("mood-value");
  var moodWeather = document.getElementById("mood-weather");
  var moodNote = document.getElementById("mood-note");
  var moodStatus = document.querySelector(".mood-status");
  var countdownGrid = document.getElementById("countdown-grid");
  var searchForm = document.getElementById("memory-search");
  var searchInput = document.getElementById("memory-search-input");
  var searchDate = document.getElementById("memory-search-date");
  var searchPlace = document.getElementById("memory-search-place");
  var searchTag = document.getElementById("memory-search-tag");
  var searchSummary = document.getElementById("search-summary");
  var searchResults = document.getElementById("search-results");
  var reportGrid = document.getElementById("report-grid");
  var holidaySection = document.getElementById("holiday-section");
  var collaborationForm = document.getElementById("collaboration-form");
  var collaborationAuthor = document.getElementById("collaboration-author");
  var collaborationType = document.getElementById("collaboration-type");
  var collaborationDate = document.getElementById("collaboration-date");
  var collaborationPlace = document.getElementById("collaboration-place");
  var collaborationContent = document.getElementById("collaboration-content");
  var collaborationPhoto = document.getElementById("collaboration-photo");
  var collaborationStatus = document.querySelector(".collaboration-status");
  var collaborationFeed = document.getElementById("collaboration-feed");
  var motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  var carouselTimer = null;
  var imageIndex = 0;
  var messageIndex = 0;
  var musicPausedByUser = false;
  var hintTimer = null;
  var carouselPausedByUser = false;
  var clearSnow = null;
  var posterRenderId = 0;
  var posterRenderPromise = Promise.resolve();
  var posterDraftInitialized = false;
  var posterActionInProgress = false;
  var posterPhotoIndex = 0;
  var wishes = [];
  var moods = [];
  var contributions = [];
  var calendarCursor = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

  function getAccessExpiry() {
    var value = String((config.access || {}).expiresAt || "").trim();
    if (!value) { return null; }
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) { value += "T23:59:59"; }
    var expiry = new Date(value);
    return Number.isNaN(expiry.getTime()) ? false : expiry;
  }

  function isShareExpired() {
    var expiry = getAccessExpiry();
    return expiry === false || (expiry && Date.now() > expiry.getTime());
  }

  function accessStorageKey() {
    var access = config.access || {};
    return "love-access-granted:" + String(access.password || "") + ":" + String(access.expiresAt || "");
  }

  function readAccessGranted() {
    try { return sessionStorage.getItem(accessStorageKey()) === "true"; } catch (error) { return false; }
  }

  function unlockPage() {
    document.body.classList.remove("access-pending");
    accessGate.hidden = true;
  }

  function setupAccessGate() {
    var access = config.access || {};
    var password = String(access.password || "");
    if (isShareExpired()) {
      accessCopy.textContent = "这个分享链接已失效。请联系分享者获取新的访问时间。";
      accessForm.hidden = true;
      return;
    }
    if (!password || readAccessGranted()) {
      unlockPage();
      return;
    }
    accessForm.addEventListener("submit", function (event) {
      event.preventDefault();
      if (accessPassword.value === password) {
        try { sessionStorage.setItem(accessStorageKey(), "true"); } catch (error) { /* Session storage is optional. */ }
        unlockPage();
        return;
      }
      accessStatus.textContent = "密码不正确，请再试一次。";
      accessPassword.select();
    });
  }

  function readMusicPreference() {
    try {
      return localStorage.getItem("love-music-paused") === "true";
    } catch (error) {
      return false;
    }
  }

  function saveMusicPreference(isPaused) {
    musicPausedByUser = isPaused;
    try { localStorage.setItem("love-music-paused", String(isPaused)); } catch (error) { /* Storage is optional. */ }
  }

  function setText(id, value) {
    document.getElementById(id).textContent = value;
  }

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>'\"]/g, function (character) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", "\"": "&quot;" }[character];
    });
  }

  function readWishes() {
    var fallback = (config.wishlist || []).map(function (item, index) {
      return { id: "default-" + index, title: item.title, category: item.category, completed: Boolean(item.completed) };
    });
    try {
      var stored = JSON.parse(localStorage.getItem("love-wishlist"));
      if (Array.isArray(stored)) {
        return stored.filter(function (item) {
          return item && typeof item.title === "string" && item.title.trim();
        });
      }
    } catch (error) { /* Use the configured list when storage is unavailable. */ }
    return fallback;
  }

  function saveWishes() {
    try { localStorage.setItem("love-wishlist", JSON.stringify(wishes)); } catch (error) { /* Storage is optional. */ }
  }

  function renderWishlist() {
    wishlist.textContent = "";
    if (!wishes.length) {
      var empty = document.createElement("li");
      empty.className = "wishlist-empty";
      empty.textContent = config.text.wishlistEmpty;
      wishlist.appendChild(empty);
      return;
    }
    wishes.forEach(function (wish) {
      var row = document.createElement("li");
      var label = document.createElement("label");
      var input = document.createElement("input");
      var text = document.createElement("span");
      var category = document.createElement("span");
      row.className = "wishlist-item" + (wish.completed ? " is-completed" : "");
      input.type = "checkbox";
      input.checked = Boolean(wish.completed);
      input.setAttribute("aria-label", "切换“" + wish.title + "”的完成状态");
      text.className = "wishlist-item-title";
      text.textContent = wish.title;
      category.className = "wishlist-category";
      category.textContent = wish.category;
      input.addEventListener("change", function () {
        wish.completed = input.checked;
        saveWishes();
        renderWishlist();
      });
      label.appendChild(input);
      label.appendChild(text);
      row.appendChild(label);
      row.appendChild(category);
      wishlist.appendChild(row);
    });
  }

  function setupWishlist() {
    (config.wishlistCategories || []).forEach(function (category) {
      var option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      wishlistCategory.appendChild(option);
    });
    wishes = readWishes();
    renderWishlist();
    wishlistForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var title = wishlistTitle.value.trim();
      if (!title) { return; }
      wishes.push({ id: String(Date.now()), title: title, category: wishlistCategory.value, completed: false });
      saveWishes();
      renderWishlist();
      wishlistForm.reset();
      wishlistStatus.textContent = config.text.wishlistAdded;
      wishlistTitle.focus();
    });
  }

  function initSnow() {
    var container = document.querySelector(".snow");
    var images;
    var camera;
    var scene;
    var renderer;
    var particles = [];
    var animationFrame = null;
    var running = false;
    var resizeHandler = null;
    var visibilityHandler = null;
    var cleanup;
    var particleCount = window.innerWidth < 768 ? 28 : 52;
    var flakeCount = window.innerWidth < 768 ? 8 : 14;

    if (clearSnow || document.body.dataset.themeEffect !== "snow" || !window.THREE || !window.THREE.CanvasRenderer || !window.Particle3D) {
      return;
    }

    clearSnow = cleanup = function () {
      running = false;
      window.cancelAnimationFrame(animationFrame);
      if (resizeHandler) { window.removeEventListener("resize", resizeHandler); }
      if (visibilityHandler) { document.removeEventListener("visibilitychange", visibilityHandler); }
      container.querySelectorAll(".snow-flake").forEach(function (flake) { flake.remove(); });
      if (renderer && renderer.domElement.parentNode) { renderer.domElement.remove(); }
      container.classList.remove("has-three");
      if (clearSnow === cleanup) { clearSnow = null; }
    };

    for (var flakeIndex = 0; flakeIndex < flakeCount; flakeIndex += 1) {
      var flake = document.createElement("img");
      flake.className = "snow-flake";
      flake.alt = "";
      flake.setAttribute("aria-hidden", "true");
      flake.src = "./images/snow/snow" + ((flakeIndex % 5) + 1) + ".png";
      flake.style.left = Math.round(Math.random() * 100) + "%";
      flake.style.setProperty("--flake-size", (10 + Math.round(Math.random() * 16)) + "px");
      flake.style.setProperty("--flake-duration", (10 + Math.round(Math.random() * 10)) + "s");
      flake.style.setProperty("--flake-delay", (-Math.round(Math.random() * 18)) + "s");
      flake.style.setProperty("--flake-drift", (-80 + Math.round(Math.random() * 160)) + "px");
      container.appendChild(flake);
    }

    images = ["snow1.png", "snow2.png", "snow3.png", "snow4.png", "snow5.png"].map(function (filename) {
      return new Promise(function (resolve) {
        var snowImage = new Image();
        snowImage.onload = function () { resolve(snowImage); };
        snowImage.onerror = function () { resolve(null); };
        snowImage.src = "./images/snow/" + filename;
      });
    });

    Promise.all(images).then(function (loadedImages) {
      var availableImages = loadedImages.filter(Boolean);
      if (!availableImages.length || clearSnow !== cleanup || document.body.dataset.themeEffect !== "snow") {
        return;
      }

      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
      camera.position.z = 1000;
      scene = new THREE.Scene();
      scene.add(camera);
      renderer = new THREE.CanvasRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);
      container.classList.add("has-three");
      container.appendChild(renderer.domElement);

      for (var index = 0; index < particleCount; index += 1) {
        var texture = new THREE.Texture(availableImages[index % availableImages.length]);
        var material = new THREE.ParticleBasicMaterial({ map: texture, transparent: true });
        var particle = new Particle3D(material);
        texture.needsUpdate = true;
        particle.position.x = Math.random() * 2000 - 1000;
        particle.position.y = Math.random() * 2000 - 1000;
        particle.position.z = Math.random() * 2000 - 1000;
        scene.add(particle);
        particles.push(particle);
      }

      function render() {
        if (!running) {
          return;
        }
        particles.forEach(function (particle) {
          particle.updatePhysics();
          if (particle.position.y < -1000) {
            particle.position.y = 1000;
          }
        });
        renderer.render(scene, camera);
        animationFrame = window.requestAnimationFrame(render);
      }

      function start() {
        if (!running && document.body.dataset.themeEffect === "snow" && !document.hidden) {
          running = true;
          render();
        }
      }

      function stop() {
        running = false;
        window.cancelAnimationFrame(animationFrame);
      }

      resizeHandler = function () {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      visibilityHandler = function () {
        if (document.hidden) { stop(); } else { start(); }
      };
      window.addEventListener("resize", resizeHandler);
      document.addEventListener("visibilitychange", visibilityHandler);
      start();
    });
  }

  function setHint(message, temporary) {
    window.clearTimeout(hintTimer);
    musicHint.textContent = message;
    musicHint.hidden = !message;
    if (temporary) {
      hintTimer = window.setTimeout(function () {
        musicHint.hidden = true;
      }, 2800);
    }
  }

  function setMusicState(isPlaying) {
    musicIcon.classList.toggle("rotate", isPlaying);
    musicButton.setAttribute("aria-pressed", String(isPlaying));
    musicButton.setAttribute("aria-label", isPlaying ? "暂停背景音乐" : "播放背景音乐");
  }

  function playMusic() {
    return audio.play().then(function () {
      saveMusicPreference(false);
      setHint(config.text.musicPlaying, true);
    }).catch(function () {
      setHint(config.text.musicUnavailable);
    });
  }

  function updateDots() {
    var dotButtons = dots.querySelectorAll("button");
    dotButtons.forEach(function (dot, index) {
      dot.setAttribute("aria-pressed", String(index === imageIndex));
    });
  }

  function showPhoto(index) {
    var photo = config.photos[index];
    image.src = photo.src;
    image.alt = photo.alt;
    caption.textContent = photo.caption;
    photoDate.textContent = photo.date ? " · " + photo.date : "";
    updateDots();
  }

  function stopCarousel(disabled) {
    window.clearInterval(carouselTimer);
    carouselTimer = null;
    carouselButton.setAttribute("aria-pressed", "true");
    carouselButton.disabled = Boolean(disabled);
    carouselButton.textContent = disabled ? "已停止" : "继续";
    carouselButton.setAttribute(
      "aria-label",
      disabled ? "已根据减少动态效果设置停止照片轮播" : "继续照片轮播"
    );
  }

  function startCarousel() {
    if (config.photos.length < 2) {
      stopCarousel(true);
      return;
    }
    window.clearInterval(carouselTimer);
    carouselTimer = window.setInterval(function () {
      imageIndex = (imageIndex + 1) % config.photos.length;
      showPhoto(imageIndex);
    }, config.carouselInterval);
    carouselButton.disabled = false;
    carouselButton.textContent = "暂停";
    carouselButton.setAttribute("aria-pressed", "false");
    carouselButton.setAttribute("aria-label", "暂停照片轮播");
  }

  function selectPhoto(index) {
    imageIndex = (index + config.photos.length) % config.photos.length;
    carouselPausedByUser = true;
    stopCarousel(false);
    showPhoto(imageIndex);
  }

  function openPhoto(photo) {
    dialogImage.src = photo.src;
    dialogImage.alt = photo.alt || photo.title || "纪念照片";
    dialogCaption.textContent = photo.caption || photo.title || "";
    dialogDate.textContent = photo.date ? " · " + photo.date : "";
    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
  }

  function closePhoto() {
    if (typeof dialog.close === "function") {
      dialog.close();
    } else {
      dialog.removeAttribute("open");
    }
  }

  function renderTimeline() {
    var timeline = document.getElementById("timeline");
    config.timeline.forEach(function (item) {
      var row = document.createElement("li");
      var date = document.createElement("time");
      var card = document.createElement("div");
      var title = document.createElement("h3");
      var text = document.createElement("p");
      var photoButton = document.createElement("button");
      var photo = document.createElement("img");

      row.className = "timeline-item";
      date.className = "timeline-date";
      date.textContent = item.date;
      card.className = "timeline-card";
      title.textContent = item.title;
      text.textContent = item.text;
      photoButton.className = "timeline-photo";
      photoButton.type = "button";
      photoButton.setAttribute("aria-label", "查看“" + item.title + "”照片");
      photo.src = item.photo;
      photo.alt = item.title;
      photoButton.appendChild(photo);
      photoButton.addEventListener("click", function () {
        openPhoto({ src: item.photo, alt: item.title, caption: item.text, date: item.date });
      });
      card.appendChild(title);
      card.appendChild(text);
      card.appendChild(photoButton);
      row.appendChild(date);
      row.appendChild(card);
      timeline.appendChild(row);
    });
  }

  function localDateValue(date) {
    return date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0") + "-" + String(date.getDate()).padStart(2, "0");
  }

  function readStoredList(key, fallback) {
    try {
      var stored = JSON.parse(localStorage.getItem(key));
      return Array.isArray(stored) ? stored : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function saveStoredList(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (error) { /* Storage is optional. */ }
  }

  function allPlaces() {
    return config.memoryPlaces || [];
  }

  function renderMemoryMap() {
    memoryMap.textContent = "";
    (config.memoryPlaces || []).forEach(function (place, index) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "map-pin";
      button.style.left = place.x + "%";
      button.style.top = place.y + "%";
      button.textContent = place.city;
      button.setAttribute("aria-label", "查看" + place.city + place.name + "的回忆");
      button.addEventListener("click", function () {
        memoryMap.querySelectorAll(".map-pin").forEach(function (pin) { pin.classList.remove("is-active"); });
        button.classList.add("is-active");
        placeDetail.innerHTML = "";
        var image = document.createElement("img");
        var copy = document.createElement("div");
        var title = document.createElement("strong");
        var text = document.createElement("p");
        image.src = place.photo;
        image.alt = place.name;
        title.textContent = place.city + " · " + place.name;
        text.textContent = place.date + " · " + place.type + " · " + place.note;
        copy.appendChild(title);
        copy.appendChild(text);
        placeDetail.appendChild(image);
        placeDetail.appendChild(copy);
      });
      memoryMap.appendChild(button);
      if (index === 0) { window.setTimeout(function () { button.click(); }, 0); }
    });
  }

  function moodForDate(value) {
    return moods.find(function (item) { return item.date === value; });
  }

  function renderMoodCalendar() {
    var year = calendarCursor.getFullYear();
    var month = calendarCursor.getMonth();
    var firstWeekday = new Date(year, month, 1).getDay();
    var days = new Date(year, month + 1, 0).getDate();
    var weekdays = ["日", "一", "二", "三", "四", "五", "六"];
    moodCalendar.textContent = "";
    calendarMonth.textContent = year + " 年 " + (month + 1) + " 月";
    weekdays.forEach(function (day) {
      var heading = document.createElement("span");
      heading.className = "calendar-weekday";
      heading.textContent = day;
      moodCalendar.appendChild(heading);
    });
    for (var blank = 0; blank < firstWeekday; blank += 1) {
      var spacer = document.createElement("span");
      spacer.className = "calendar-day is-empty";
      moodCalendar.appendChild(spacer);
    }
    for (var day = 1; day <= days; day += 1) {
      (function (dateValue, number) {
        var entry = moodForDate(dateValue);
        var button = document.createElement("button");
        button.type = "button";
        button.className = "calendar-day" + (entry ? " has-mood" : "");
        button.innerHTML = "<span>" + number + "</span>" + (entry ? "<small>" + escapeHtml(entry.mood) + "</small>" : "");
        button.setAttribute("aria-label", dateValue + (entry ? "，" + entry.mood + "，" + (entry.note || "") : "，记录心情"));
        button.addEventListener("click", function () {
          moodDate.value = dateValue;
          moodValue.value = entry ? entry.mood : "开心";
          moodWeather.value = entry ? entry.weather || "" : "";
          moodNote.value = entry ? entry.note || "" : "";
          moodDate.focus();
        });
        moodCalendar.appendChild(button);
      }(year + "-" + String(month + 1).padStart(2, "0") + "-" + String(day).padStart(2, "0"), day));
    }
  }

  function renderCountdowns() {
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    countdownGrid.textContent = "";
    (config.countdowns || []).forEach(function (item) {
      var target = dateForReminder(item, today);
      var days = Math.max(0, Math.ceil((target - today) / 86400000));
      var card = document.createElement("article");
      card.className = "countdown-tile";
      card.innerHTML = "<p>" + escapeHtml(item.type) + "</p><strong>" + days + "</strong><span>天</span><h3>" + escapeHtml(item.name) + "</h3><small>" + target.toLocaleDateString("zh-CN", { month: "long", day: "numeric" }) + "</small>";
      countdownGrid.appendChild(card);
    });
  }

  function searchEntries() {
    var timelineEntries = (config.timeline || []).map(function (item) {
      return { type: "事件", title: item.title, text: item.text, date: item.date.replace(/\./g, "-"), place: "", tags: ["时间线"], photo: item.photo };
    });
    var placeEntries = allPlaces().map(function (item) {
      return { type: item.type || "地点", title: item.city + " · " + item.name, text: item.note || "", date: item.date || "", place: item.city, tags: item.tags || [], photo: item.photo || "" };
    });
    var contributionEntries = contributions.map(function (item) {
      return { type: item.type === "message" ? "留言" : (item.type === "photo" ? "照片" : "事件"), title: item.author + " 的" + (item.type === "message" ? "留言" : "投稿"), text: item.content, date: item.date, place: item.place || "", tags: ["协作"], photo: item.photo || "" };
    });
    return timelineEntries.concat(placeEntries, contributionEntries);
  }

  function populateSearchFilters() {
    var places = [];
    var tags = [];
    searchEntries().forEach(function (item) {
      if (item.place && places.indexOf(item.place) === -1) { places.push(item.place); }
      item.tags.forEach(function (tag) { if (tags.indexOf(tag) === -1) { tags.push(tag); } });
    });
    searchPlace.innerHTML = "<option value=\"\">全部地点</option>";
    searchTag.innerHTML = "<option value=\"\">全部标签</option>";
    places.forEach(function (place) { searchPlace.add(new Option(place, place)); });
    tags.forEach(function (tag) { searchTag.add(new Option(tag, tag)); });
  }

  function renderSearchResults() {
    var query = searchInput.value.trim().toLowerCase();
    var results = searchEntries().filter(function (item) {
      var text = [item.title, item.text, item.date, item.place].concat(item.tags).join(" ").toLowerCase();
      return (!query || text.indexOf(query) !== -1) && (!searchDate.value || item.date === searchDate.value) && (!searchPlace.value || item.place === searchPlace.value) && (!searchTag.value || item.tags.indexOf(searchTag.value) !== -1);
    });
    searchResults.textContent = "";
    searchSummary.textContent = results.length ? "找到 " + results.length + " 个回忆" : "没有找到相符的回忆，试试更短的关键词或清空筛选。";
    results.forEach(function (item) {
      var card = document.createElement("article");
      card.className = "search-result";
      card.innerHTML = (item.photo ? "<img src=\"" + escapeHtml(item.photo) + "\" alt=\"\">" : "") + "<div><span>" + escapeHtml(item.type) + " · " + escapeHtml(item.date || "未标注日期") + "</span><h3>" + escapeHtml(item.title) + "</h3><p>" + escapeHtml(item.text) + "</p><small>" + item.tags.map(escapeHtml).join(" · ") + "</small></div>";
      searchResults.appendChild(card);
    });
  }

  function renderReport() {
    var places = allPlaces();
    var frequency = {};
    places.concat(contributions.filter(function (item) { return item.place; }).map(function (item) { return { city: item.place }; })).forEach(function (item) { frequency[item.city] = (frequency[item.city] || 0) + 1; });
    var favorite = Object.keys(frequency).sort(function (a, b) { return frequency[b] - frequency[a]; })[0] || "等待解锁";
    var start = new Date(config.anniversaryDate);
    var days = Math.max(1, Math.floor((Date.now() - start.getTime()) / 86400000) + 1);
    var stats = [{ value: days, label: "共同经历天数" }, { value: config.photos.length + contributions.filter(function (item) { return item.photo; }).length, label: "珍藏照片" }, { value: config.timeline.length + contributions.length, label: "回忆事件" }, { value: favorite, label: "高频地点" }];
    reportGrid.textContent = "";
    stats.forEach(function (stat) {
      var tile = document.createElement("article");
      tile.className = "report-tile";
      tile.innerHTML = "<strong>" + stat.value + "</strong><span>" + stat.label + "</span>";
      reportGrid.appendChild(tile);
    });
  }

  function renderContributions() {
    collaborationFeed.textContent = "";
    if (!contributions.length) {
      collaborationFeed.textContent = "还没有新的投稿，等你们一起写下第一条。";
      return;
    }
    contributions.slice().reverse().forEach(function (item) {
      var row = document.createElement("article");
      row.className = "contribution";
      row.innerHTML = (item.photo ? "<img src=\"" + escapeHtml(item.photo) + "\" alt=\"" + escapeHtml(item.content) + "\">" : "") + "<div><strong>" + escapeHtml(item.author) + " · " + (item.type === "message" ? "留言" : item.type === "photo" ? "照片" : "事件") + "</strong><p>" + escapeHtml(item.content) + "</p><small>" + escapeHtml(item.date) + (item.place ? " · " + escapeHtml(item.place) : "") + "</small></div>";
      collaborationFeed.appendChild(row);
    });
  }

  function renderHoliday() {
    var today = localDateValue(new Date());
    var monthDay = today.slice(5);
    var holiday = (config.holidays || []).find(function (item) { return item.date === today || item.date === monthDay; });
    if (!holiday) { return; }
    document.getElementById("holiday-eyebrow").textContent = holiday.eyebrow;
    document.getElementById("holiday-heading").textContent = holiday.title;
    document.getElementById("holiday-message").textContent = holiday.message;
    holidaySection.hidden = false;
    selectTheme(holiday.theme, false);
  }

  function setupMemoryHub() {
    moods = readStoredList("love-moods", config.moods || []);
    contributions = readStoredList("love-contributions", []);
    moodDate.value = getLocalDate();
    collaborationDate.value = getLocalDate();
    (config.collaborators || []).forEach(function (name) { collaborationAuthor.add(new Option(name, name)); });
    allPlaces().forEach(function (place) { collaborationPlace.add(new Option(place.city, place.city)); });
    renderMemoryMap();
    renderMoodCalendar();
    renderCountdowns();
    populateSearchFilters();
    renderSearchResults();
    renderReport();
    renderContributions();
  }

  function renderDots() {
    config.photos.forEach(function (photo, index) {
      var dot = document.createElement("button");
      dot.className = "gallery-dot";
      dot.type = "button";
      dot.setAttribute("aria-label", "查看第 " + (index + 1) + " 张照片：" + photo.caption);
      dot.addEventListener("click", function () {
        selectPhoto(index);
      });
      dots.appendChild(dot);
    });
    updateDots();
  }

  function updateTitle(timeParts) {
    var now = new Date();
    var anniversary = new Date(config.anniversaryDate);
    var isAnniversary = now.getMonth() === anniversary.getMonth() && now.getDate() === anniversary.getDate();
    var value = isAnniversary ? now.getFullYear() - anniversary.getFullYear() : timeParts[0];
    var unit = isAnniversary ? "年" : "天";
    document.title = config.text.anniversaryTitle.replace("{value}", value).replace("{unit}", unit);
    setText("share-days", timeParts[0]);
  }

  function dateForReminder(reminder, today) {
    if (!reminder.annual) { return new Date(reminder.date); }
    var parts = String(reminder.date).split("-");
    var date = new Date(today.getFullYear(), Number(parts[0]) - 1, Number(parts[1]));
    if (date < today) { date.setFullYear(date.getFullYear() + 1); }
    return date;
  }

  function updateNextAnniversary() {
    var now = new Date();
    var anniversary = new Date(config.anniversaryDate);
    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var next = new Date(now.getFullYear(), anniversary.getMonth(), anniversary.getDate());
    var reminderName = config.text.nextAnniversaryName.replace("{first}", config.names.first).replace("{second}", config.names.second);
    var countdownName = config.text.anniversaryMilestone.replace("{value}", Math.max(1, next.getFullYear() - anniversary.getFullYear()));
    if (next < today) { next.setFullYear(next.getFullYear() + 1); }
    countdownName = config.text.anniversaryMilestone.replace("{value}", Math.max(1, next.getFullYear() - anniversary.getFullYear()));
    (config.importantDates || []).forEach(function (reminder) {
      var date = dateForReminder(reminder, today);
      if (!Number.isNaN(date.getTime()) && date >= today && date < next) {
        next = date;
        reminderName = reminder.name;
        countdownName = reminder.name;
      }
    });
    setText("next-anniversary-name", reminderName);
    setText("anniversary-countdown-label", config.text.countdownPrefix + " " + countdownName + " " + config.text.countdownSuffix);
    setText("anniversary-days", Math.ceil((next - today) / 86400000));
    setText("next-anniversary-date", next.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric"
    }));
  }

  function showMessage(index) {
    messageIndex = index % config.messages.length;
    setText("love-letter", config.messages[messageIndex]);
  }

  function setPosterStatus(message) {
    posterStatus.textContent = message;
  }

  function getLocalDate() {
    var now = new Date();
    return now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0") + "-" + String(now.getDate()).padStart(2, "0");
  }

  function getPosterOptions() {
    var selectedTemplate = document.querySelector("input[name='poster-template']:checked");
    var dimensions = { portrait: [1080, 1350], square: [1080, 1080], story: [1080, 1920] };
    return {
      template: selectedTemplate.value,
      size: posterSize.value,
      dimensions: dimensions[posterSize.value],
      color: posterColor.value,
      date: posterDate.value,
      message: posterMessage.value.trim() || config.text.posterMessage,
      usePhoto: posterUsePhoto.checked,
      photo: config.photos[posterPhotoIndex]
    };
  }

  function formatPosterDate(value) {
    var parts = value.split("-");
    return parts.length === 3 ? Number(parts[0]) + "年" + Number(parts[1]) + "月" + Number(parts[2]) + "日" : "";
  }

  function colorWithAlpha(hex, alpha) {
    var value = hex.replace("#", "");
    var red = parseInt(value.slice(0, 2), 16);
    var green = parseInt(value.slice(2, 4), 16);
    var blue = parseInt(value.slice(4, 6), 16);
    return "rgba(" + red + ", " + green + ", " + blue + ", " + alpha + ")";
  }

  function getPosterMessageLimit() {
    var dimensions = { portrait: [1080, 1350], square: [1080, 1080], story: [1080, 1920] };
    var scale = dimensions[posterSize.value][0] / 1080;
    var maxWidth = dimensions[posterSize.value][0] * 0.72;
    var widestCharacter;

    posterContext.font = "400 " + (35 * scale) + "px sans-serif";
    widestCharacter = Math.max(posterContext.measureText("字").width, posterContext.measureText("W").width);
    // Keep one character of slack in each line so normal punctuation never overflows.
    return Math.max(1, (Math.floor(maxWidth / widestCharacter) - 1) * 3);
  }

  function syncPosterMessageLimit() {
    var limit = getPosterMessageLimit();
    var characters = Array.from(posterMessage.value);

    posterMessage.maxLength = limit;
    if (characters.length > limit) {
      posterMessage.value = characters.slice(0, limit).join("");
      setPosterStatus("文案已缩短为海报可完整显示的内容");
    }
    posterMessageCount.textContent = "还可输入 " + Math.max(0, limit - Array.from(posterMessage.value).length) + " 字（最多 " + limit + " 字）";
  }

  function syncPhotoTemplates() {
    var canUsePhoto = posterUsePhoto.checked;
    var selectedTemplate = document.querySelector("input[name='poster-template']:checked");

    document.querySelectorAll("input[name='poster-template']").forEach(function (input) {
      var needsPhoto = input.value === "photo" || input.value === "film";
      input.disabled = needsPhoto && !canUsePhoto;
      input.closest(".poster-template").classList.toggle("is-disabled", input.disabled);
    });
    posterPhotoPicker.querySelectorAll("button").forEach(function (button) {
      button.disabled = !canUsePhoto;
    });
    if (!canUsePhoto && selectedTemplate && selectedTemplate.disabled) {
      document.querySelector("input[name='poster-template'][value='classic']").checked = true;
      setPosterStatus("已关闭照片，海报已切换为心动留白模板");
    }
  }

  function syncPosterThemeSelection() {
    var matchingTheme = config.themes.find(function (theme) {
      return theme.tokens.primary.toLowerCase() === posterColor.value.toLowerCase();
    });
    posterTheme.value = matchingTheme ? matchingTheme.tokens.primary : "";
  }

  function renderPosterThemePicker() {
    config.themes.forEach(function (theme) {
      var option = document.createElement("option");
      option.value = theme.tokens.primary;
      option.textContent = theme.label;
      posterTheme.appendChild(option);
    });
  }

  function updatePosterPhotoPicker() {
    posterPhotoPicker.querySelectorAll("button").forEach(function (button, index) {
      var selected = index === posterPhotoIndex;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
  }

  function renderPosterPhotoPicker() {
    config.photos.forEach(function (photo, index) {
      var button = document.createElement("button");
      var image = document.createElement("img");
      button.type = "button";
      button.className = "poster-photo-choice";
      button.setAttribute("aria-label", "选择照片：" + (photo.caption || photo.title || (index + 1)));
      image.src = photo.src;
      image.alt = "";
      button.appendChild(image);
      button.addEventListener("click", function () {
        posterPhotoIndex = index;
        posterUsePhoto.checked = true;
        syncPhotoTemplates();
        updatePosterPhotoPicker();
        queuePosterRender();
      });
      posterPhotoPicker.appendChild(button);
    });
    updatePosterPhotoPicker();
  }

  function getPosterLayout(options, height, scale) {
    var filmLayouts = {
      portrait: { top: height * 0.62, imageHeight: height * 0.45 },
      square: { top: height * 0.5, imageHeight: height * 0.3 },
      story: { top: height * 0.63, imageHeight: height * 0.45 }
    };
    var messageOffset = 332 * scale;
    var messageLineHeight = 44 * scale;
    var whiteFrameBottom = height - 80 * scale;
    var safeBottom = whiteFrameBottom;
    var preferredTop;

    if (options.template === "film") {
      preferredTop = filmLayouts[options.size].top;
      return {
        // Reserve space for all three message baselines inside the white film frame.
        top: Math.min(preferredTop, safeBottom - messageOffset - messageLineHeight * 2),
        imageHeight: filmLayouts[options.size].imageHeight,
        dateOffset: 54 * scale,
        daysOffset: 240 * scale,
        leadOffset: 290 * scale,
        messageOffset: messageOffset,
        messageLineHeight: messageLineHeight
      };
    }
    return {
      // The text-only poster uses a dedicated, more deliberate vertical rhythm.
      top: options.template === "classic"
        ? height * (options.size === "story" ? 0.3 : (options.size === "square" ? 0.18 : 0.21))
        : (options.usePhoto ? Math.min(470 * scale, height * 0.4) : height * 0.34),
      dateOffset: 66 * scale,
      daysOffset: 280 * scale,
      leadOffset: 338 * scale,
      messageOffset: 465 * scale,
      messageLineHeight: 58 * scale
    };
  }

  function drawCoverImage(context, source, x, y, width, height) {
    var sourceWidth = source && (source.naturalWidth || source.width);
    var sourceHeight = source && (source.naturalHeight || source.height);
    var scale;
    var drawWidth;
    var drawHeight;

    if (!sourceWidth || !sourceHeight) { return false; }
    scale = Math.max(width / sourceWidth, height / sourceHeight);
    drawWidth = sourceWidth * scale;
    drawHeight = sourceHeight * scale;
    try {
      context.drawImage(source, x + (width - drawWidth) / 2, y + (height - drawHeight) / 2, drawWidth, drawHeight);
      return true;
    } catch (error) {
      return false;
    }
  }

  function drawWrappedText(context, text, x, y, maxWidth, lineHeight) {
    var lines = [];
    text.split(/\r\n?|\n/).forEach(function (paragraph) {
      var line = "";
      Array.from(paragraph).forEach(function (character) {
        if (context.measureText(line + character).width > maxWidth && line) {
          lines.push(line);
          line = character;
        } else {
          line += character;
        }
      });
      if (line || !paragraph) { lines.push(line); }
    });
    lines.slice(0, 3).forEach(function (item, index) {
      context.fillText(item, x, y + index * lineHeight);
    });
    return lines.length > 3;
  }

  function loadPosterImage(src) {
    return new Promise(function (resolve) {
      var photo = new Image();
      photo.onload = function () { resolve(photo); };
      photo.onerror = function () { resolve(null); };
      // Request CORS permission before assigning src so remote photos remain exportable.
      if (window.location.protocol !== "file:" && !/^data:|^blob:/i.test(src)) { photo.crossOrigin = "anonymous"; }
      photo.src = src;
    });
  }

  function isPosterImageExportable(photo) {
    var testCanvas = document.createElement("canvas");
    var testContext = testCanvas.getContext("2d");

    try {
      testCanvas.width = 1;
      testCanvas.height = 1;
      testContext.drawImage(photo, 0, 0, 1, 1);
      testCanvas.getImageData(0, 0, 1, 1);
      return true;
    } catch (error) {
      return false;
    }
  }

  function renderPoster() {
    var options = getPosterOptions();
    var renderId = ++posterRenderId;
    var width = options.dimensions[0];
    var height = options.dimensions[1];
    var scale = width / 1080;
    var days = document.getElementById("share-days").textContent;

    posterCanvas.width = width;
    posterCanvas.height = height;
    posterPreviewWrap.classList.add("is-rendering");
    posterPreviewWrap.setAttribute("aria-busy", "true");
    setPosterStatus("正在更新预览...");
    return (options.usePhoto ? loadPosterImage(options.photo.src) : Promise.resolve(null)).then(function (photo) {
      var context = posterContext;
      var gradient;
      var layout;
      var messageTruncated;
      var photoCannotExport = photo && !isPosterImageExportable(photo);
      if (renderId !== posterRenderId) { return; }

      if (photoCannotExport) { photo = null; }

      if ((options.template === "photo" || options.template === "film") && !photo) {
        document.querySelector("input[name='poster-template'][value='classic']").checked = true;
        setPosterStatus(photoCannotExport ? "该照片不允许跨域导出，已切换为纯文字模板" : "当前照片无法加载，已切换为纯文字模板");
        return queuePosterRender();
      }

      context.clearRect(0, 0, width, height);
      context.fillStyle = "#fffdfd";
      context.fillRect(0, 0, width, height);
      gradient = context.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, colorWithAlpha(options.color, 0));
      gradient.addColorStop(1, colorWithAlpha(options.color, 0.18));
      context.fillStyle = gradient;
      context.fillRect(0, 0, width, height);

      if (options.template === "photo" && photo) {
        drawCoverImage(context, photo, 0, 0, width, height);
        gradient = context.createLinearGradient(0, height * 0.18, 0, height);
        gradient.addColorStop(0, "rgba(22, 12, 17, 0.08)");
        gradient.addColorStop(0.45, "rgba(22, 12, 17, 0.16)");
        gradient.addColorStop(0.67, "rgba(22, 12, 17, 0.62)");
        gradient.addColorStop(1, "rgba(22, 12, 17, 0.9)");
        context.fillStyle = gradient;
        context.fillRect(0, 0, width, height);
      } else if (options.template === "film" && photo) {
        var filmInset = 54 * scale;
        var filmCardInset = 96 * scale;
        var filmImageX = 128 * scale;
        var filmImageY = 142 * scale;

        context.fillStyle = "#21161c";
        context.fillRect(0, 0, width, height);
        context.fillStyle = options.color;
        context.fillRect(filmInset, filmInset, width - filmInset * 2, height - filmInset * 2);
        context.fillStyle = "#fffdf9";
        context.fillRect(filmCardInset, 100 * scale, width - filmCardInset * 2, height - 180 * scale);
        context.fillStyle = "#21161c";
        for (var perforationY = 122 * scale; perforationY < height - 122 * scale; perforationY += 74 * scale) {
          context.fillRect(70 * scale, perforationY, 26 * scale, 40 * scale);
          context.fillRect(width - 96 * scale, perforationY, 26 * scale, 40 * scale);
        }
        layout = getPosterLayout(options, height, scale);
        drawCoverImage(context, photo, filmImageX, filmImageY, width - filmImageX * 2, layout.imageHeight);
      } else {
        context.fillStyle = colorWithAlpha(options.color, 0.075);
        context.fillRect(0, 0, 28 * scale, height);
        context.fillStyle = colorWithAlpha(options.color, 0.11);
        context.beginPath();
        context.arc(width * 0.93, height * 0.08, 168 * scale, 0, Math.PI * 2);
        context.fill();
        if (photo) {
          context.save();
          context.beginPath();
          context.arc(width * 0.5, 252 * scale, 150 * scale, 0, Math.PI * 2);
          context.clip();
          drawCoverImage(context, photo, width * 0.5 - 150 * scale, 102 * scale, 300 * scale, 300 * scale);
          context.restore();
        }
      }

      layout = layout || getPosterLayout(options, height, scale);
      var top = layout.top;
      context.textAlign = "center";
      if (options.template === "classic") {
        var unitWidth;
        var footerY = Math.min(height - 95 * scale, top + 820 * scale);

        context.strokeStyle = colorWithAlpha(options.color, 0.2);
        context.lineWidth = 2 * scale;
        context.strokeRect(54 * scale, 54 * scale, width - 108 * scale, height - 108 * scale);
        context.fillStyle = colorWithAlpha(options.color, 0.8);
        context.font = "600 " + (19 * scale) + "px sans-serif";
        context.fillText("OUR DAYS", width / 2, top - 104 * scale);
        context.fillStyle = options.color;
        context.font = "500 " + (46 * scale) + "px sans-serif";
        context.fillText(config.names.first + "  &  " + config.names.second, width / 2, top);
        context.fillStyle = colorWithAlpha(options.color, 0.78);
        context.font = "400 " + (26 * scale) + "px sans-serif";
        context.fillText(formatPosterDate(options.date), width / 2, top + 64 * scale);
        context.strokeStyle = colorWithAlpha(options.color, 0.4);
        context.lineWidth = 2 * scale;
        context.beginPath();
        context.moveTo(width / 2 - 76 * scale, top + 116 * scale);
        context.lineTo(width / 2 + 76 * scale, top + 116 * scale);
        context.stroke();
        context.fillStyle = options.color;
        context.font = "400 " + (218 * scale) + "px Georgia, serif";
        context.fillText(days, width / 2, top + 354 * scale);
        unitWidth = context.measureText(days).width;
        context.font = "500 " + (36 * scale) + "px sans-serif";
        context.fillText(config.text.shareUnit, width / 2 + unitWidth / 2 + 20 * scale, top + 344 * scale);
        context.fillStyle = colorWithAlpha(options.color, 0.86);
        context.font = "500 " + (32 * scale) + "px sans-serif";
        context.fillText(config.text.shareLead, width / 2, top + 434 * scale);
        context.fillStyle = "#3e2530";
        context.font = "400 " + (35 * scale) + "px sans-serif";
        messageTruncated = drawWrappedText(context, options.message, width / 2, top + 590 * scale, width * 0.68, 54 * scale);
        context.strokeStyle = colorWithAlpha(options.color, 0.28);
        context.lineWidth = 1 * scale;
        context.beginPath();
        context.moveTo(width / 2 - 50 * scale, footerY - 30 * scale);
        context.lineTo(width / 2 + 50 * scale, footerY - 30 * scale);
        context.stroke();
        context.fillStyle = colorWithAlpha(options.color, 0.72);
        context.font = "500 " + (18 * scale) + "px sans-serif";
        context.fillText("A DAY TO REMEMBER", width / 2, footerY);
      } else if (options.template === "photo") {
        var photoX = 88 * scale;
        var photoTop = height * (options.size === "story" ? 0.6 : (options.size === "square" ? 0.39 : 0.5));
        var photoUnitWidth;

        context.textAlign = "left";
        context.shadowColor = "rgba(0, 0, 0, 0.74)";
        context.shadowBlur = 12 * scale;
        context.shadowOffsetY = 2 * scale;
        context.fillStyle = "rgba(255,255,255,0.84)";
        context.font = "600 " + (18 * scale) + "px sans-serif";
        context.fillText("A MOMENT TO KEEP", photoX, 96 * scale);
        context.fillStyle = "#fff";
        context.font = "500 " + (52 * scale) + "px sans-serif";
        context.fillText(config.names.first + "  &  " + config.names.second, photoX, photoTop);
        context.fillStyle = "rgba(255,255,255,0.82)";
        context.font = "400 " + (26 * scale) + "px sans-serif";
        context.fillText(formatPosterDate(options.date), photoX, photoTop + 58 * scale);
        context.fillStyle = colorWithAlpha(options.color, 0.9);
        context.fillRect(photoX, photoTop + 90 * scale, 84 * scale, 5 * scale);
        context.fillStyle = "#fff";
        context.font = "400 " + (202 * scale) + "px Georgia, serif";
        context.fillText(days, photoX, photoTop + 322 * scale);
        photoUnitWidth = context.measureText(days).width;
        context.font = "500 " + (36 * scale) + "px sans-serif";
        context.fillText(config.text.shareUnit, photoX + photoUnitWidth + 18 * scale, photoTop + 310 * scale);
        context.fillStyle = "rgba(255,255,255,0.9)";
        context.font = "500 " + (31 * scale) + "px sans-serif";
        context.fillText(config.text.shareLead, photoX, photoTop + 397 * scale);
        context.fillStyle = "rgba(255,255,255,0.94)";
        context.font = "400 " + (34 * scale) + "px sans-serif";
        messageTruncated = drawWrappedText(context, options.message, photoX, photoTop + 510 * scale, width - photoX * 2, 52 * scale);
      } else {
        var filmX = 128 * scale;
        var filmUnitWidth;

        context.textAlign = "left";
        context.fillStyle = colorWithAlpha(options.color, 0.8);
        context.font = "600 " + (18 * scale) + "px sans-serif";
        context.fillText("FILM  01", filmX, top - 56 * scale);
        context.fillStyle = "#2d1720";
        context.font = "500 " + (42 * scale) + "px sans-serif";
        context.fillText(config.names.first + "  &  " + config.names.second, filmX, top);
        context.fillStyle = colorWithAlpha(options.color, 0.8);
        context.font = "400 " + (24 * scale) + "px sans-serif";
        context.fillText(formatPosterDate(options.date), filmX, top + 52 * scale);
        context.strokeStyle = colorWithAlpha(options.color, 0.4);
        context.lineWidth = 2 * scale;
        context.beginPath();
        context.moveTo(filmX, top + 84 * scale);
        context.lineTo(filmX + 92 * scale, top + 84 * scale);
        context.stroke();
        context.fillStyle = options.color;
        context.font = "400 " + (148 * scale) + "px Georgia, serif";
        context.fillText(days, filmX, top + 246 * scale);
        filmUnitWidth = context.measureText(days).width;
        context.font = "500 " + (32 * scale) + "px sans-serif";
        context.fillText(config.text.shareUnit, filmX + filmUnitWidth + 16 * scale, top + 236 * scale);
        context.fillStyle = "#3e2530";
        context.font = "500 " + (30 * scale) + "px sans-serif";
        context.fillText(config.text.shareLead, filmX, top + 306 * scale);
        context.font = "400 " + (31 * scale) + "px sans-serif";
        messageTruncated = drawWrappedText(context, options.message, filmX, top + 332 * scale, width - filmX * 2, 44 * scale);
      }
      if (options.template === "photo") {
        context.shadowColor = "transparent";
        context.shadowBlur = 0;
        context.shadowOffsetY = 0;
      }
      setPosterStatus(photoCannotExport ? "该照片不允许跨域导出，已使用无照片布局" : (messageTruncated ? "文案过长，预览仅显示前三行" : "预览已更新"));
      posterPreviewWrap.classList.remove("is-rendering");
      posterPreviewWrap.setAttribute("aria-busy", "false");
    }).catch(function (error) {
      if (renderId === posterRenderId) {
        posterPreviewWrap.classList.remove("is-rendering");
        posterPreviewWrap.setAttribute("aria-busy", "false");
        setPosterStatus("预览生成失败，请检查照片后重试");
      }
      throw error;
    });
  }

  function queuePosterRender() {
    posterRenderPromise = renderPoster();
    return posterRenderPromise;
  }

  function openPosterEditor() {
    if (!posterDraftInitialized) {
      posterColor.value = getThemeToken("primary") || "#C81E4B";
      posterDate.value = getLocalDate();
      posterMessage.value = config.text.posterMessage;
      posterPhotoIndex = imageIndex;
      posterDraftInitialized = true;
    }
    syncPosterThemeSelection();
    syncPhotoTemplates();
    syncPosterMessageLimit();
    if (typeof posterDialog.showModal === "function") {
      posterDialog.showModal();
    } else {
      posterDialog.setAttribute("open", "");
    }
    queuePosterRender();
  }

  function closePosterEditor() {
    if (typeof posterDialog.close === "function") {
      posterDialog.close();
    } else {
      posterDialog.removeAttribute("open");
    }
  }

  function setPosterActionState(isBusy, message) {
    posterActionInProgress = isBusy;
    downloadPosterButton.disabled = isBusy;
    sharePosterButton.disabled = isBusy;
    posterControls.querySelectorAll("input, select, textarea, button").forEach(function (control) {
      control.disabled = isBusy;
    });
    if (!isBusy) { syncPhotoTemplates(); }
    posterActions.setAttribute("aria-busy", String(isBusy));
    downloadPosterButton.setAttribute("aria-busy", String(isBusy));
    sharePosterButton.setAttribute("aria-busy", String(isBusy));
    if (message) { setPosterStatus(message); }
  }

  function createPosterSnapshot() {
    var snapshot = document.createElement("canvas");
    snapshot.width = posterCanvas.width;
    snapshot.height = posterCanvas.height;
    snapshot.getContext("2d").drawImage(posterCanvas, 0, 0);
    return snapshot;
  }

  function getPosterBlob(canvas) {
    return new Promise(function (resolve, reject) {
      try {
        if (typeof canvas.toBlob === "function") {
          canvas.toBlob(function (blob) {
            if (blob) { resolve(blob); } else { reject(new Error("Canvas export failed")); }
          }, "image/png");
          return;
        }
        resolve(dataUrlToBlob(canvas.toDataURL("image/png")));
      } catch (error) {
        reject(error);
      }
    });
  }

  function dataUrlToBlob(dataUrl) {
    var parts = dataUrl.split(",");
    var mime = (parts[0].match(/data:([^;]+)/) || [])[1] || "image/png";
    var binary = window.atob(parts[1]);
    var bytes = new Uint8Array(binary.length);
    var index;

    for (index = 0; index < binary.length; index += 1) { bytes[index] = binary.charCodeAt(index); }
    return new Blob([bytes], { type: mime });
  }

  function getPosterExportErrorMessage(error) {
    if (error && (error.name === "SecurityError" || /taint|security/i.test(error.message || ""))) {
      return "所选照片不支持导出，请换一张照片后重试";
    }
    return "海报生成失败，请重试";
  }

  function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  }

  function triggerPosterDownload(blob) {
    var link = document.createElement("a");
    var url = URL.createObjectURL(blob);
    link.href = url;
    link.download = config.text.posterFilename;
    document.body.appendChild(link);
    if (isIOS()) {
      link.target = "_blank";
      link.rel = "noopener";
      link.click();
      link.remove();
      window.setTimeout(function () { URL.revokeObjectURL(url); }, 60000);
      return "图片已打开，请长按图片保存到相册";
    }
    link.click();
    link.remove();
    window.setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    return "海报已开始下载";
  }

  function downloadPoster() {
    if (posterActionInProgress) { return Promise.resolve(); }
    setPosterActionState(true, "正在生成海报...");
    return posterRenderPromise.then(createPosterSnapshot).then(getPosterBlob).then(function (blob) {
      setPosterStatus(triggerPosterDownload(blob));
    }).catch(function (error) {
      setPosterStatus(getPosterExportErrorMessage(error));
    }).then(function () {
      setPosterActionState(false);
    });
  }

  function sharePoster() {
    if (posterActionInProgress) { return Promise.resolve(); }
    setPosterActionState(true, "正在生成海报...");
    return posterRenderPromise.then(createPosterSnapshot).then(getPosterBlob).then(function (blob) {
      var file;
      var data;
      if (typeof File !== "function") {
        setPosterStatus(triggerPosterDownload(blob));
        return;
      }
      file = new File([blob], config.text.posterFilename, { type: "image/png" });
      data = { files: [file], title: config.names.first + " & " + config.names.second, text: posterMessage.value.trim() || config.text.posterMessage };
      if (navigator.share && (!navigator.canShare || navigator.canShare(data))) {
        return navigator.share(data).then(function () {
          setPosterStatus("海报已发送到系统分享面板");
        }).catch(function (error) {
          if (error.name === "AbortError") { setPosterStatus("已取消分享"); } else { setPosterStatus("分享失败，请重试或下载海报"); }
        });
      }
      if (isIOS()) {
        setPosterStatus(triggerPosterDownload(blob));
      } else {
        triggerPosterDownload(blob);
        setPosterStatus("当前浏览器不支持直接分享，已改为下载海报");
      }
    }).catch(function (error) {
      setPosterStatus(getPosterExportErrorMessage(error));
    }).then(function () {
      setPosterActionState(false);
    });
  }

  document.title = config.text.pageTitle;
  setText("first-name", config.names.first);
  setText("second-name", config.names.second);
  setText("intro", config.text.intro);
  setText("anniversary-eyebrow", config.text.nextCelebrationEyebrow);
  setText("anniversary-heading", config.text.nextCelebrationHeading);
  setText("next-anniversary-name", config.text.nextAnniversaryName.replace("{first}", config.names.first).replace("{second}", config.names.second));
  setText("anniversary-days-label", config.text.daysUntil);
  setText("letter-eyebrow", config.text.noteEyebrow);
  setText("letter-heading", config.text.noteHeading);
  setText("wishlist-eyebrow", config.text.wishlistEyebrow);
  setText("wishlist-heading", config.text.wishlistHeading);
  setText("wishlist-intro", config.text.wishlistIntro);
  setText("wishlist-submit", config.text.wishlistAdd);
  setText("timeline-eyebrow", config.text.timelineEyebrow);
  setText("timeline-heading", config.text.timelineHeading);
  setText("share-eyebrow", config.text.shareEyebrow);
  setText("share-heading", config.text.shareHeading);
  setText("share-lead", config.text.shareLead);
  setText("share-unit", config.text.shareUnit);
  setText("share-note", config.text.shareNote);
  setText("poster-dialog-title", config.text.posterEditorTitle);
  setText("theme-eyebrow", config.text.themeEyebrow);
  setText("theme-heading", config.text.themeHeading);
  document.querySelector(".refresh-message").textContent = config.text.refreshMessage;
  document.querySelector(".generate-poster").textContent = config.text.createPoster;
  audio.src = config.music.src;
  audio.setAttribute("type", config.music.type);
  musicPausedByUser = readMusicPreference();
  showPhoto(imageIndex);
  renderDots();
  renderTimeline();
  setupWishlist();
  setupMemoryHub();
  showMessage(messageIndex);
  updateNextAnniversary();
  if (!musicPausedByUser) { setHint(config.text.musicPrompt); }
  countTime(config.anniversaryDate, "day", "hour", "minute", "second", updateTitle);
  startCarousel();

  audio.addEventListener("play", function () {
    setMusicState(true);
  });
  audio.addEventListener("pause", function () {
    setMusicState(false);
  });

  musicButton.addEventListener("click", function () {
    if (audio.paused) {
      playMusic();
    } else {
      audio.pause();
      saveMusicPreference(true);
      setHint("", false);
    }
  });

  carouselButton.addEventListener("click", function () {
    if (carouselTimer === null) {
      carouselPausedByUser = false;
      startCarousel();
    } else {
      carouselPausedByUser = true;
      stopCarousel(false);
    }
  });

  document.querySelector(".previous-photo").addEventListener("click", function () {
    selectPhoto(imageIndex - 1);
  });
  document.querySelector(".next-photo").addEventListener("click", function () {
    selectPhoto(imageIndex + 1);
  });
  document.querySelector(".fullscreen-photo").addEventListener("click", function () {
    openPhoto(config.photos[imageIndex]);
  });
  document.querySelector(".dialog-close").addEventListener("click", function () {
    closePhoto();
  });
  dialog.addEventListener("click", function (event) {
    if (event.target === dialog) {
      closePhoto();
    }
  });

  document.querySelector(".refresh-message").addEventListener("click", function () {
    showMessage(messageIndex + 1);
  });
  document.querySelector(".generate-poster").addEventListener("click", openPosterEditor);
  document.querySelector(".poster-close").addEventListener("click", closePosterEditor);
  downloadPosterButton.addEventListener("click", downloadPoster);
  sharePosterButton.addEventListener("click", sharePoster);
  posterTheme.addEventListener("change", function () {
    if (posterTheme.value) { posterColor.value = posterTheme.value; }
  });
  posterColor.addEventListener("input", syncPosterThemeSelection);
  document.querySelectorAll(".poster-controls input, .poster-controls select, .poster-controls textarea").forEach(function (control) {
    control.addEventListener("input", function () {
      syncPosterMessageLimit();
      queuePosterRender();
    });
    control.addEventListener("change", function () {
      syncPhotoTemplates();
      syncPosterMessageLimit();
      queuePosterRender();
    });
  });
  posterDialog.addEventListener("click", function (event) {
    if (event.target === posterDialog) {
      closePosterEditor();
    }
  });

  function getThemeToken(name) {
    return getComputedStyle(document.documentElement).getPropertyValue("--" + name).trim();
  }

  function renderThemePicker() {
    themePicker.setAttribute("aria-label", config.text.themePickerLabel);
    config.themes.forEach(function (theme) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "theme-button";
      button.dataset.theme = theme.id;
      button.setAttribute("aria-pressed", "false");
      button.textContent = theme.label;
      button.addEventListener("click", function () {
        selectTheme(theme.id);
      });
      themePicker.appendChild(button);
    });
  }

  function selectTheme(themeId, persist) {
    var theme = config.themes.find(function (item) {
      return item.id === themeId;
    }) || config.themes[0];

    Object.keys(theme.tokens).forEach(function (token) {
      document.documentElement.style.setProperty("--" + token, theme.tokens[token]);
    });
    document.body.dataset.theme = theme.id;
    document.body.dataset.themeEffect = theme.effect || "none";
    if (theme.effect === "snow") {
      initSnow();
    } else if (clearSnow) {
      clearSnow();
    }
    document.getElementById("theme-color").setAttribute("content", theme.tokens.background);
    document.querySelectorAll(".theme-button").forEach(function (item) {
      var selected = item.dataset.theme === theme.id;
      item.classList.toggle("is-active", selected);
      item.setAttribute("aria-pressed", String(selected));
    });
    if (persist !== false) {
      try { localStorage.setItem("love-theme", theme.id); } catch (error) { /* Storage is optional. */ }
    }
  }

  renderThemePicker();
  renderPosterThemePicker();
  renderPosterPhotoPicker();
  try { selectTheme(localStorage.getItem("love-theme") || config.defaultTheme); } catch (error) { selectTheme(config.defaultTheme); }
  renderHoliday();
  setupAccessGate();

  document.querySelector(".banner").addEventListener("focusin", function (event) {
    if (event.target !== carouselButton && carouselTimer !== null) {
      carouselPausedByUser = true;
      stopCarousel(false);
    }
  });

  document.querySelector(".calendar-previous").addEventListener("click", function () {
    calendarCursor.setMonth(calendarCursor.getMonth() - 1);
    renderMoodCalendar();
  });
  document.querySelector(".calendar-next").addEventListener("click", function () {
    calendarCursor.setMonth(calendarCursor.getMonth() + 1);
    renderMoodCalendar();
  });
  moodForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var entry = { date: moodDate.value, mood: moodValue.value, weather: moodWeather.value.trim(), note: moodNote.value.trim() };
    var existing = moods.findIndex(function (item) { return item.date === entry.date; });
    if (existing === -1) { moods.push(entry); } else { moods[existing] = entry; }
    saveStoredList("love-moods", moods);
    calendarCursor = new Date(entry.date + "T00:00:00");
    calendarCursor.setDate(1);
    renderMoodCalendar();
    moodStatus.textContent = "已记录 " + entry.date + " 的心情。";
  });
  searchForm.addEventListener("input", renderSearchResults);
  searchForm.addEventListener("change", renderSearchResults);
  collaborationForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var submit = function (photo) {
      contributions.push({ id: String(Date.now()), author: collaborationAuthor.value, type: collaborationType.value, date: collaborationDate.value, place: collaborationPlace.value, content: collaborationContent.value.trim(), photo: photo || "" });
      saveStoredList("love-contributions", contributions);
      collaborationForm.reset();
      collaborationDate.value = getLocalDate();
      collaborationStatus.textContent = "已提交，新的回忆已加入我们的小天地。";
      renderContributions();
      populateSearchFilters();
      renderSearchResults();
      renderReport();
    };
    var file = collaborationPhoto.files[0];
    if (!file) { submit(""); return; }
    if (file.size > 1500000) {
      collaborationStatus.textContent = "照片请控制在 1.5MB 以内，方便保存在浏览器中。";
      return;
    }
    var reader = new FileReader();
    reader.onload = function () { submit(String(reader.result)); };
    reader.onerror = function () { collaborationStatus.textContent = "照片读取失败，请重试。"; };
    reader.readAsDataURL(file);
  });
  window.setInterval(renderCountdowns, 60000);

}());
