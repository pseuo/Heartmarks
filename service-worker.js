"use strict";

var CACHE_NAME = "valentine-day-v1";
var CORE_ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./app-icon-192.png",
  "./app-icon-512.png",
  "./favicon.ico",
  "./pic-icon.png",
  "./css/index.css?v=font-woff2",
  "./js/three.js",
  "./js/site-config.js",
  "./js/count-time.js",
  "./js/app.js",
  "./js/pwa.js",
  "./font/CHERI___.woff2",
  "./font/CHERL___.woff2",
  "./font/WenCangShuFang-2.woff2",
  "./images/love.jpg",
  "./images/1.jpg",
  "./images/2.jpg",
  "./images/3.jpg",
  "./images/snow/snow1.png",
  "./images/snow/snow2.png",
  "./images/snow/snow3.png",
  "./images/snow/snow4.png",
  "./images/snow/snow5.png",
  "./media/zui-mei-qing-lv-cut.mp3"
];

function cacheResponse(request, response) {
  if (!response || !response.ok) { return response; }
  return caches.open(CACHE_NAME).then(function (cache) {
    return cache.put(request, response.clone()).then(function () { return response; });
  });
}

function networkFirst(request) {
  return fetch(request).then(function (response) {
    return cacheResponse(request, response);
  }).catch(function () {
    return caches.match(request).then(function (cached) {
      return cached || caches.match("./index.html");
    });
  });
}

function staleWhileRevalidate(event) {
  var request = event.request;
  var refresh = fetch(request).then(function (response) {
    return cacheResponse(request, response);
  }).catch(function () { return null; });

  event.waitUntil(refresh);

  return caches.match(request).then(function (cached) {
    if (cached) {
      return cached;
    }
    return refresh.then(function (response) {
      return response || new Response("当前内容暂不可用。", {
        status: 503,
        statusText: "Offline",
        headers: { "Content-Type": "text/plain; charset=utf-8" }
      });
    });
  });
}

function cachedRangeResponse(request) {
  return caches.match(request).then(function (cached) {
    var range = request.headers.get("range");
    var match;
    var start;
    var end;

    if (!cached || !range) { return fetch(request); }
    match = /^bytes=(\d*)-(\d*)$/.exec(range);
    if (!match) { return fetch(request); }
    return cached.arrayBuffer().then(function (buffer) {
      var total = buffer.byteLength;
      start = match[1] ? Number(match[1]) : Math.max(0, total - Number(match[2] || 0));
      end = match[2] && match[1] ? Math.min(Number(match[2]), total - 1) : total - 1;
      if (start >= total || end < start) {
        return new Response(null, { status: 416, headers: { "Content-Range": "bytes */" + total } });
      }
      return new Response(buffer.slice(start, end + 1), {
        status: 206,
        statusText: "Partial Content",
        headers: {
          "Accept-Ranges": "bytes",
          "Content-Length": String(end - start + 1),
          "Content-Range": "bytes " + start + "-" + end + "/" + total,
          "Content-Type": cached.headers.get("Content-Type") || "audio/mpeg"
        }
      });
    });
  });
}

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(CORE_ASSETS);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (names) {
      return Promise.all(names.filter(function (name) {
        return name.indexOf("valentine-day-") === 0 && name !== CACHE_NAME;
      }).map(function (name) {
        return caches.delete(name);
      }));
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener("fetch", function (event) {
  var request = event.request;
  var url = new URL(request.url);

  if (request.method !== "GET" || url.origin !== self.location.origin) { return; }
  if (request.headers.has("range")) {
    event.respondWith(cachedRangeResponse(request));
    return;
  }
  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request));
    return;
  }
  event.respondWith(staleWhileRevalidate(event));
});
