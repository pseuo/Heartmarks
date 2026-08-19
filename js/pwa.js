(function () {
  "use strict";

  var installButton = document.querySelector(".pwa-install");
  var installStatus = document.querySelector(".pwa-install-status");
  var deferredInstallPrompt = null;

  function isStandalone() {
    return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  }

  function isIOS() {
    return /iPad|iPhone|iPod/.test(window.navigator.userAgent) ||
      (window.navigator.platform === "MacIntel" && window.navigator.maxTouchPoints > 1);
  }

  function setStatus(message) {
    installStatus.textContent = message;
    installStatus.hidden = !message;
  }

  function registerServiceWorker() {
    if (!("serviceWorker" in navigator)) { return; }
    navigator.serviceWorker.register("./service-worker.js").catch(function () {
      // The page remains fully usable when a host does not support service workers.
    });
  }

  window.addEventListener("beforeinstallprompt", function (event) {
    event.preventDefault();
    deferredInstallPrompt = event;
    if (!isStandalone()) { installButton.hidden = false; }
  });

  window.addEventListener("appinstalled", function () {
    deferredInstallPrompt = null;
    installButton.hidden = true;
    setStatus("");
  });

  installButton.addEventListener("click", function () {
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      deferredInstallPrompt.userChoice.then(function (choice) {
        if (choice.outcome === "accepted") {
          installButton.hidden = true;
          setStatus("");
        }
        deferredInstallPrompt = null;
      });
      return;
    }
    if (isIOS()) {
      setStatus("请在 Safari 中点按分享按钮，然后选择“添加到主屏幕”。");
    }
  });

  if (!isStandalone() && isIOS()) { installButton.hidden = false; }
  window.addEventListener("load", registerServiceWorker);
}());
